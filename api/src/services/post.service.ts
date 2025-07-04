import { AppDataSource } from '../database/data-source';
import { Post } from '../entities/Post';

const postRepository = AppDataSource.getRepository(Post);

export const postService = {
  findAll: () => postRepository.find(),
  
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
    return postRepository.findOneBy({ id });
  },
  
  delete: (id: number) => postRepository.delete(id),
};
