import api from './api';
import { Post } from '../types/Post';

export const getAllPosts = async (): Promise<Post[]> => {
  const res = await api.get<Post[]>('/post/all');
  return res.data;
};

export const getMyPosts = async (): Promise<Post[]> => {
  const res = await api.get<Post[]>('/post/mine');
  return res.data;
};


export const createPost = (data: { title: string; content: string }) =>
  api.post('/post', data);

export const updatePost = (id: number, data: any) =>
  api.put(`/post/${id}`, data);
export const deletePost = (id: number) =>
  api.delete(`/post/${id}`);



