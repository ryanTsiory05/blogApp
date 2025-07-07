import api from "./api";
import { Post } from "../types/Post";

export const getAllPosts = async (query = ""): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>("/posts", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Erreur lors de la récupération des posts :",
        error.message
      );
      throw new Error("Le serveur est momentanément indisponible.");
    } else {
      console.error(
        "Erreur inconnue lors de la récupération des posts :",
        error
      );
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
};

export const getMyPosts = async (): Promise<Post[]> => {
  const res = await api.get<Post[]>("/posts/mine");
  return res.data;
};

export const getOnePost = async (id: number): Promise<Post> => {
  const res = await api.get<Post>(`/posts/${id}`);
  return res.data;
};

export const createPost = (data: { title: string; content: string }) =>
  api.post("/posts", data);

export const updatePost = (id: number, data: any) =>
  api.put(`/posts/${id}`, data);

export const deletePost = (id: number) => api.delete(`/posts/${id}`);
