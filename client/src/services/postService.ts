import api from "./api";
import { Post } from "../types/Post";

export const getAllPosts = async (
  query = "",
  page = 1,
  limit = 5
): Promise<{ data: Post[]; total: number }> => {
  try {
    const response = await api.get<{ data: Post[]; total: number }>("/posts", {
      params: { query, page, limit },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error retrieving posts :", error.message);
      throw new Error("The server is temporarily unavailable.");
    } else {
      console.error("Error retrieving :", error);
      throw new Error("An unknown error has occurred.");
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
