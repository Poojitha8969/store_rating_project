// backend/src/controllers/adminController.js
import { Op, fn, col, literal } from 'sequelize';
import { User, ROLES } from '../models/User.js';
import { Store } from '../models/Store.js';
import { Rating } from '../models/Rating.js';
import { hashPassword } from '../utils/password.js';

const like = (v) => ({ [Op.iLike]: '%${v}%' });

export const dashboard = async (_req, res) => {
  try {
    const [users, stores, ratings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    return res.json({ users, stores, ratings });
  } catch {
    return res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

export const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    if (!Object.values(ROLES).includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, address, role, password: await hashPassword(password) });
    return res.status(201).json({ id: user.id });
  } catch {
    return res.status(500).json({ message: 'Failed to add user' });
  }
};

export const addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    let owner = null;
    if (owner_id) {
      owner = await User.findByPk(owner_id);
      if (!owner || owner.role !== ROLES.STORE_OWNER) return res.status(400).json({ message: 'Invalid owner' });
    }
    const store = await Store.create({ name, email, address, owner_id: owner?.id || null });
    return res.status(201).json({ id: store.id });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to add store' });
  }
};

export const listUsers = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'created_at', order = 'desc', name, email, address, role } = req.query;
  const where = {
    ...(name ? { name: like(name) } : {}),
    ...(email ? { email: like(email) } : {}),
    ...(address ? { address: like(address) } : {}),
    ...(role ? { role } : {}),
  };
  try {
    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'created_at'],
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: [[sortBy, order.toUpperCase()]],
    });
    return res.json({ items: rows, total: count, page: +page, pages: Math.ceil(count / +limit) });
  } catch {
    return res.status(500).json({ message: 'Failed to list users' });
  }
};

export const listStores = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'name', order = 'asc', name, email, address } = req.query;
  const where = {
    ...(name ? { name: like(name) } : {}),
    ...(email ? { email: like(email) } : {}),
    ...(address ? { address: like(address) } : {}),
  };
  try {
    const { rows, count } = await Store.findAndCountAll({
      where,
      include: [
        { model: Rating, attributes: [] },
      ],
      attributes: {
        include: [[fn('COALESCE', fn('AVG', col('ratings.rating')), 0), 'avg_rating']],
      },
      group: ['store.id'],
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: [[sortBy, order.toUpperCase()]],
      subQuery: false,
    });
    return res.json({ items: rows, total: count.length || count, page: +page, pages: Math.ceil((count.length || count) / +limit) });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to list stores' });
  }
};