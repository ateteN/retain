import { Router } from 'express';
import { getUserDashboard } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.get('/', authenticate, (req, res, next) => {
  getUserDashboard(req, res).catch(next);
});

export default router;