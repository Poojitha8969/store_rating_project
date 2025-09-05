// backend/src/models/User.js
import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../settings/db.js';

export const ROLES = { ADMIN: 'ADMIN', USER: 'USER', STORE_OWNER: 'STORE_OWNER' };

export class User extends Model {}
User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING(400), allowNull: false },
    role: { type: DataTypes.ENUM(...Object.values(ROLES)), allowNull: false, defaultValue: ROLES.USER },
  },
  { sequelize, modelName: 'user', underscored: true }
);