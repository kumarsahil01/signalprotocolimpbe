// src/controllers/messageController.js
import models from '../models/index.js';
const { Message } = models;
import { Op } from "sequelize";
import { getIO, onlineUsersMap } from '../sockets/chatSocket.js'; // we'll export these

// Send via REST
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, ciphertext, header } = req.body;
    const senderId = req.user.sub || req.user.userId;

    if (!receiverId || !ciphertext) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Save message (initially undelivered)
    const msg = await Message.create({
      senderId,
      receiverId,
      ciphertext,
      header,
      isDelivered: false,
      isRead: false,
    });

    // Try deliver via socket
    const io = getIO();
    const receiverSocketId = onlineUsersMap.get(receiverId); // Map userId -> socketId
    if (io && receiverSocketId) {
      io.to(receiverSocketId).emit('new_message', msg);
      // Mark delivered
      msg.isDelivered = true;
      msg.deliveredAt = new Date();
      await msg.save();
    }

    res.status(201).json({ message: 'Message sent', msg });
  } catch (error) {
    console.error('Message send failed:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch ALL messages for this user (or only undelivered if query param)
export const fetchConversation = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.sub;
    const { targetId } = req.params; // ID of the other participant

    if (!userId || !targetId) {
      return res.status(400).json({ error: "Missing userId or targetId" });
    }

    // Find all messages between userId and targetId
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    if (!messages || messages.length === 0) {
      return res.status(200).json({ message: "No conversation found", data: [] });
    }

    res.status(200).json({
      message: "Conversation fetched successfully",
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Conversation fetch failed:", error);
    res.status(500).json({ error: error.message });
  }
};


// Mark a message as read (can be called by client when message decrypted & displayed)
export const markMessageRead = async (req, res) => {
  try {
    const userId = req.user.sub || req.user.userId;
    const { messageId } = req.body;
    if (!messageId) return res.status(400).json({ error: 'messageId required' });

    const msg = await Message.findOne({ where: { id: messageId, receiverId: userId } });
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    msg.isRead = true;
    msg.readAt = new Date();
    await msg.save();

    // Notify sender (if online)
    const io = getIO();
    const senderSocketId = onlineUsersMap.get(msg.senderId);
    if (io && senderSocketId) {
      io.to(senderSocketId).emit('message_read', { messageId: msg.id, readAt: msg.readAt });
    }

    res.json({ message: 'Marked read', msg });
  } catch (error) {
    console.error('Mark read failed:', error);
    res.status(500).json({ error: error.message });
  }
};
