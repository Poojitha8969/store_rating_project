// backend/src/routes/stores.js
import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { listStoresForUser, upsertRating } from '../controllers/storeController.js';
import { ratingRule } from '../validation/rules.js';
import { handleValidation } from '../middlewares/validate.js';

const router = Router();

router.use(auth);
router.get('/stores', listStoresForUser);
router.post('/stores/:id/rate', [ratingRule, handleValidation], upsertRating);
router.put('/stores/:id/rate', [ratingRule, handleValidation], upsertRating);

export default router;