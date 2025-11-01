import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserKey = sequelize.define('UserKey', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    deviceId: { type: DataTypes.UUID, allowNull: false },
    identityKeyPub: { type: DataTypes.TEXT, allowNull: false },
    signedPrekeyPub: { type: DataTypes.TEXT, allowNull: false },
    signedPrekeySignature: { type: DataTypes.TEXT, allowNull: false },
    oneTimePrekeys: { type: DataTypes.JSONB, defaultValue: [] },
    lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  return UserKey;
};
