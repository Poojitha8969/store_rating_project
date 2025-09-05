// backend/src/controllers/ownerController.js
import { fn, col } from 'sequelize';
import { Store } from '../models/Store.js';
import { Rating } from '../models/Rating.js';
import { User } from '../models/User.js';

export const ownerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) return res.status(404).json({ message: 'No store for owner' });

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['updated_at', 'DESC']],
    });

    const avg = await Rating.findOne({
      where: { store_id: store.id },
      attributes: [[fn('COALESCE', fn('AVG', col('rating')), 0), 'avg_rating']],
      raw: true,
    });

    return res.json({
      store: { id: store.id, name: store.name, address: store.address },
      avg_rating: Number(avg.avg_rating),
      raters: ratings.map((r) => ({ id: r.user.id, name: r.user.name, email: r.user.email, rating: r.rating, updated_at: r.updated_at })),
    });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load owner dashboard' });
  }
};