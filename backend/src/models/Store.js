// backend/src/models/Store.js
import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../settings/db.js';

export class Store extends Model {}
Store.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, validate: { isEmail: true } },
    address: { type: DataTypes.STRING(400), allowNull: false },
  },
  { sequelize, modelName: 'store', underscored: true }
);