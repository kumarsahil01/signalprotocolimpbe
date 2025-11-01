import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MessageStatus = sequelize.define('MessageStatus', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    messageId: { type: DataTypes.UUID, allowNull: false },
    receiverId: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'sent' },
  });
  return MessageStatus;
};
