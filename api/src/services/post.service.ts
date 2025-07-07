import { Like } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Post } from '../entities/Post';

const postRepository = AppDataSource.getRepository(Post);

export const postService = {
  findAll: async (
    query?: string,
    page = 1,
    limit = 5
  ): Promise<{ posts: Post[]; total: number }> => {
    const qb = postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.updated_at', 'DESC');

    if (query) {
      const q = `%${query.toLowerCase()}%`;
      qb.where('LOWER(post.title) LIKE :q', { q })
        .orWhere('LOWER(post.content) LIKE :q', { q })
        .orWhere('LOWER(author.username) LIKE :q', { q });
    }

    // Pagination
    qb.skip((page - 1) * limit).take(limit);

    const [posts, total] = await qb.getManyAndCount();

    return { posts, total };
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
