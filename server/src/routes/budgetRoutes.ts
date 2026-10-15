import { Router } from 'express';
import { setBudget, getBudgetStatus } from '../controllers/budgetController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const wrap = (fn: any) => (req: any, res: any, next: any) => fn(req, res).catch(next);

router.get('/status', wrap(getBudgetStatus));
router.put('/', wrap(setBudget));

export default router;