// backend/src/controllers/storeController.js
import { Op, fn, col } from 'sequelize';
import { Store } from '../models/Store.js';
import { Rating } from '../models/Rating.js';

export const listStoresForUser = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const where = search
    ? { [Op.or]: [{ name: { [Op.iLike]: '%${search}% '} }, { address: { [Op.iLike]: '%${search}%' } }] }
    : {};
  try {
    const { rows, count } = await Store.findAndCountAll({
      where,
      include: [{ model: Rating, attributes: [] }],
      attributes: {
        include: [[fn('COALESCE', fn('AVG', col('ratings.rating')), 0), 'avg_rating']],
      },
      group: ['store.id'],
      limit: +limit,
      offset: (+page - 1) * +limit,
      subQuery: false,
      order: [['name', 'ASC']],
    });

    const storeIds = rows.map((s) => s.id);
    const myRatings = await Rating.findAll({ where: { user_id: req.user.id, store_id: storeIds } });
    const myRatingMap = Object.fromEntries(myRatings.map((r) => [r.store_id, r.rating]));

    const items = rows.map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      avg_rating: Number(s.get('avg_rating')),
      my_rating: myRatingMap[s.id] ?? null,
    }));

    return res.json({ items, total: count.length || count, page: +page, pages: Math.ceil((count.length || count) / +limit) });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load stores' });
  }
};

export const upsertRating = async (req, res) => {
  const { id } = req.params; // store id
  const { rating } = req.body;
  try {
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [rec, created] = await Rating.findOrCreate({
      where: { user_id: req.user.id, store_id: id },
      defaults: { rating },
    });
    if (!created) {
      rec.rating = rating;
      await rec.save();
    }
    return res.json({ message: created ? 'Rating created' : 'Rating updated' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to submit rating' });
  }
};