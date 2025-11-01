import { Sequelize } from 'sequelize';
import dbConfig from '../config/config.js';
import User from './user.js';
import Device from './device.js';
import UserKey from './userKey.js';
import Message from './message.js';
import MessageStatus from './messageStatus.js';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Create Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Initialize models
const models = {
  User: User(sequelize),
  Device: Device(sequelize),
  UserKey: UserKey(sequelize),
  Message: Message(sequelize),
  MessageStatus: MessageStatus(sequelize),
};

// Define associations
models.User.hasMany(models.Device, { foreignKey: 'userId' });
models.Device.belongsTo(models.User, { foreignKey: 'userId' });

models.User.hasMany(models.UserKey, { foreignKey: 'userId' });
models.UserKey.belongsTo(models.User, { foreignKey: 'userId' });

models.User.hasMany(models.Message, { as: 'messagesSent', foreignKey: 'senderId' });
models.User.hasMany(models.Message, { as: 'messagesReceived', foreignKey: 'receiverId' });
models.Message.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
models.Message.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId' });

models.Message.hasMany(models.MessageStatus, { foreignKey: 'messageId' });
models.MessageStatus.belongsTo(models.Message, { foreignKey: 'messageId' });

// Export everything
export { sequelize };
export default models;
