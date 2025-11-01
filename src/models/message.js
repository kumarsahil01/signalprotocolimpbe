import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Message = sequelize.define('Message', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, allowNull: false },
    receiverId: { type: DataTypes.UUID, allowNull: false },
    ciphertext: { type: DataTypes.TEXT, allowNull: false },
    header: { type: DataTypes.JSONB },
    deliveredAt: DataTypes.DATE,
    readAt: DataTypes.DATE,
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
  return Message;
};
