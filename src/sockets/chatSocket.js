// src/sockets/chatSocket.js
import models from '../models/index.js';
const { Message } = models;

let ioInstance = null;
export const onlineUsersMap = new Map(); // userId -> socketId

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('⚡ New socket connected:', socket.id);

    socket.on('register', async (userId) => {
      socket.userId = userId;
      onlineUsersMap.set(userId, socket.id);
      console.log(`✅ User ${userId} registered on socket ${socket.id}`);

      try {
        // Find undelivered messages for this user
        const pending = await Message.findAll({
          where: { receiverId: userId, isDelivered: false },
          order: [['createdAt', 'ASC']],
        });

        // Emit each and mark delivered
        for (const msg of pending) {
          io.to(socket.id).emit('new_message', msg);

          msg.isDelivered = true;
          msg.deliveredAt = new Date();
          await msg.save();
        }
      } catch (err) {
        console.error('Error delivering pending messages:', err.message);
      }
    });

    // Allow client to send via socket (optional)
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, ciphertext, header } = data;
        const msg = await Message.create({ senderId, receiverId, ciphertext, header });

        const receiverSocketId = onlineUsersMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', msg);
          msg.isDelivered = true;
          msg.deliveredAt = new Date();
          await msg.save();
        }
      } catch (err) {
        console.error('Socket send_message error:', err.message);
      }
    });

    // Read receipt via socket
    socket.on('message_read', async ({ messageId }) => {
      try {
        const msg = await Message.findOne({ where: { id: messageId } });
        if (!msg) return;

        msg.isRead = true;
        msg.readAt = new Date();
        await msg.save();

        const senderSocketId = onlineUsersMap.get(msg.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read', { messageId: msg.id, readAt: msg.readAt });
        }
      } catch (err) {
        console.error('Socket message_read error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) onlineUsersMap.delete(socket.userId);
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => ioInstance;
