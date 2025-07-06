import { Like } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Post } from '../entities/Post';

const postRepository = AppDataSource.getRepository(Post);

export const postService = {
    findAll: async (query?: string) => {
      const qb = postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.author", "author")
    .orderBy("post.updated_at", "DESC");

  if (query) {
    qb.where("LOWER(post.title) LIKE :q", { q: `%${query.toLowerCase()}%` })
      .orWhere("LOWER(post.content) LIKE :q", { q: `%${query.toLowerCase()}%` })
      .orWhere("LOWER(author.username) LIKE :q", { q: `%${query.toLowerCase()}%` });
  }

  return qb.getMany()
  },
  
  findOne: (id: number) => postRepository.findOneBy({ id }),
  
  findByUserId: async (userId: number) => {
      return await postRepository.find({
        where: { author: { id: userId } },
        relations: ['author'],
        order: { updated_at: 'DESC' },
      });
    },

  create: (postData: Partial<Post>) => postRepository.save(postData),
  
  update: async (id: number, postData: Partial<Post>) => {
    await postRepository.update(id, postData);
  },
  
  delete: (id: number) => postRepository.delete(id),
};
