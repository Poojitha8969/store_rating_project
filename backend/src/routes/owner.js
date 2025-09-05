// backend/src/routes/owner.js
import { Router } from 'express';
import { auth, requireRole } from '../middlewares/auth.js';
import { ROLES } from '../models/User.js';
import { ownerDashboard } from '../controllers/ownerController.js';

const router = Router();

router.use(auth, requireRole(ROLES.STORE_OWNER));
router.get('/dashboard', ownerDashboard);

export default router;