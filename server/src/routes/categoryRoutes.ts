import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const wrap = (fn: any) => (req: any, res: any, next: any) => fn(req, res).catch(next);

router.get('/', wrap(listCategories));
router.post('/', requireAdmin, wrap(createCategory));
router.put('/:id', requireAdmin, wrap(updateCategory));
router.delete('/:id', requireAdmin, wrap(deleteCategory));

export default router;