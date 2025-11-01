import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Device = sequelize.define('Device', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    deviceName: DataTypes.STRING,
    deviceType: DataTypes.STRING,
    lastSeen: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  return Device;
};
