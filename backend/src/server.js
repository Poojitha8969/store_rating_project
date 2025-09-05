// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  sequelize  from './settings/db.js';
import './settings/associations.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import storeRoutes from './routes/stores.js';
import ownerRoutes from './routes/owner.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', storeRoutes); // /stores, /stores/:id/rate
app.use('/api/owner', ownerRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // For demo; use migrations in production.
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`API on :${port}`))
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
};
start();