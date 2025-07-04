import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.get('/all', catchAsync(postController.getAll));
router.get('/mine', authMiddleware, catchAsync(postController.getMine));
router.get('/:id', catchAsync(postController.getOne));
router.post('/',  authMiddleware, catchAsync(postController.create));
router.put('/:id', authMiddleware, catchAsync(postController.update));
router.delete('/:id', authMiddleware, catchAsync(postController.delete));

export default router;
