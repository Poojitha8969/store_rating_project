// backend/src/settings/associations.js
import { User } from '../models/User.js';
import { Store } from '../models/Store.js';
import { Rating } from '../models/Rating.js';

// Store owner relation (optional 1:1)
User.hasOne(Store, { foreignKey: { name: 'owner_id', allowNull: true }, as: 'ownedStore' });
Store.belongsTo(User, { foreignKey: { name: 'owner_id', allowNull: true }, as: 'owner' });

// Ratings
User.hasMany(Rating, { foreignKey: { name: 'user_id', allowNull: false } });
Rating.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false } });

Store.hasMany(Rating, { foreignKey: { name: 'store_id', allowNull: false } });
Rating.belongsTo(Store, { foreignKey: { name: 'store_id', allowNull: false } });

export {}; // side-effects only