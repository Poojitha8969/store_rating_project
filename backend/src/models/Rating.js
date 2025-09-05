// backend/src/models/Rating.js
import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../settings/db.js';

export class Rating extends Model {}
Rating.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  },
  { sequelize, modelName: 'rating', underscored: true }
);