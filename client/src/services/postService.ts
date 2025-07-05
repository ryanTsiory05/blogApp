import api from './api';
import { Post } from '../types/Post';

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const res = await api.get<Post[]>('/post/all');
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors de la récupération des posts :", error.message);
      throw new Error('Le serveur est momentanément indisponible.');
    } else {
      console.error("Erreur inconnue lors de la récupération des posts :", error);
      throw new Error('Une erreur inconnue est survenue.');
    }
  }
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



