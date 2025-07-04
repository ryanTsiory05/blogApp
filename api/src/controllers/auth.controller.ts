import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { User } from '../entities/User';
import { authService } from '../services/auth.service';

export const authController = {
  register: async (req: Request, res: Response) => {
    const user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

    const errors = await validate(user);
    if (errors.length > 0) res.status(400).json(errors);

    try {
      const saved = await authService.register(user);
      res.status(201).json({ id: saved.id, username: saved.username });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  },

  login: async (req: Request, res: Response) => {
    console.log(req.body)
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      const { user, token } = await authService.login(email, password);
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  },
};
