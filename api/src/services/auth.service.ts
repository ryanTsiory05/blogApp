import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(User);

export const authService = {
  register: (userData: Partial<User>) => {
    const user = userRepo.create(userData);
    return userRepo.save(user);
  },

  login: async (email: string, password: string) => {
    const user = await userRepo.findOneBy({ email });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { user, token };
  },
};
