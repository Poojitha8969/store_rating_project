// backend/src/middlewares/auth.js
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = { id: user.id, role: user.role, name: user.name };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};