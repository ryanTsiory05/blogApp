import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import postRoutes from './routes/post.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.URL_CLIENT, //  React port
  credentials: true, 
}));

app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('Database connection failed', error));
