// backend/src/routes/admin.js
import { Router } from 'express';
import { auth, requireRole } from '../middlewares/auth.js';
import { ROLES } from '../models/User.js';
import { addUser, addStore, dashboard, listUsers, listStores } from '../controllers/adminController.js';
import { nameRule, emailRule, addressRule, passwordRule, listParams } from '../validation/rules.js';
import { handleValidation } from '../middlewares/validate.js';

const router = Router();

router.use(auth, requireRole(ROLES.ADMIN));

router.get('/dashboard', dashboard);
router.post('/users', [nameRule, emailRule, addressRule, passwordRule, handleValidation], addUser);
router.post('/stores', [nameRule, emailRule, addressRule, handleValidation], addStore);
router.get('/users', listParams, handleValidation, listUsers);
router.get('/stores', listParams, handleValidation, listStores);

export default router;