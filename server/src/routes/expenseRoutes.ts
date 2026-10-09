import { Router } from 'express';
import { listExpenses, getExpense, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const wrap = (fn: any) => (req: any, res: any, next: any) => fn(req, res).catch(next);

router.get('/', wrap(listExpenses));
router.get('/:id', wrap(getExpense));
router.post('/', wrap(createExpense));
router.put('/:id', wrap(updateExpense));
router.delete('/:id', wrap(deleteExpense));

export default router;