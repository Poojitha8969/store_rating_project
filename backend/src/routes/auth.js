// backend/src/routes/auth.js
import { Router } from 'express';
import { signup, login, updatePassword } from '../controllers/authController.js';
import { nameRule, emailRule, addressRule, passwordRule } from '../validation/rules.js';
import { handleValidation } from '../middlewares/validate.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', [nameRule, emailRule, addressRule, passwordRule, handleValidation], signup);
router.post('/login', login);
router.put('/update-password', [auth, passwordRule, handleValidation], updatePassword);

export default router;