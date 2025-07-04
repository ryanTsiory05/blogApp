import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Post } from '../entities/Post';
import { postService } from '../services/post.service';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const postController = {
  getAll: async (_: Request, res: Response) => {
    const posts = await postService.findAll();
    res.json(posts);
  },

  getOne: async (req: Request, res: Response) => {
    const post = await postService.findOne(Number(req.params.id));
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  },

  getMine: async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
    // const userId = 1;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const posts = await postService.findByUserId(userId);
  res.json(posts);
},

create: async (req: AuthenticatedRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Fill out the form.' });
  }

  const post = new Post();
  post.title = title;
  post.content = content;
  post.author = { id: req.user.id } as any;

  const errors = await validate(post);
  if (errors.length > 0) return res.status(400).json(errors);

  const saved = await postService.create(post);
  res.status(201).json(saved);
},


update: async (req: AuthenticatedRequest, res: Response) => {
  const postId = Number(req.params.id);
  const post = await postService.findOne(postId);

  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.id !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to update this post' });
  }

  const { title, content } = req.body;
  const updated = await postService.update(postId, { title, content });

  res.json(updated);
},

delete: async (req: AuthenticatedRequest, res: Response) => {
  const postId = Number(req.params.id);
  const post = await postService.findOne(postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.author.id !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to delete this post' });
  }

  await postService.delete(postId);
  res.status(204).send();
},
};
