import { Router } from 'express';
import { getAdminInsights } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/insights', (req, res, next) => {
  getAdminInsights(req, res).catch(next);
});

export default router;