import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(listCategories));
router.post('/', requireAdmin, asyncHandler(createCategory));
router.put('/:id', requireAdmin, asyncHandler(updateCategory));
router.delete('/:id', requireAdmin, asyncHandler(deleteCategory));

export default router;