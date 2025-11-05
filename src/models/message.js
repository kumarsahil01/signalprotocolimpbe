// src/models/message.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Message = sequelize.define('Message', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, allowNull: false },
    receiverId: { type: DataTypes.UUID, allowNull: false },
    ciphertext: { type: DataTypes.TEXT, allowNull: false },
    header: { type: DataTypes.JSONB },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deliveredAt: { type: DataTypes.DATE, allowNull: true },
    readAt: { type: DataTypes.DATE, allowNull: true },
    isDelivered: { type: DataTypes.BOOLEAN, defaultValue: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'Messages',
    timestamps: false, // if you use createdAt above; otherwise set true and remove createdAt field
  });

  return Message;
};
