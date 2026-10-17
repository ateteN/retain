import { Router } from 'express';
import { setBudget, getBudgetStatus } from '../controllers/budgetController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);

router.get('/status', asyncHandler(getBudgetStatus));
router.put('/', asyncHandler(setBudget));

export default router;