import { Router } from 'express';
import { listExpenses, getExpense, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(listExpenses));
router.get('/:id', asyncHandler(getExpense));
router.post('/', asyncHandler(createExpense));
router.put('/:id', asyncHandler(updateExpense));
router.delete('/:id', asyncHandler(deleteExpense));

export default router;