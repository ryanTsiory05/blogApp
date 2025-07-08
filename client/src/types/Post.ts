import { User } from "./User";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  created_at: string;
  updated_at: string;
}

export interface PostForm {
  title: string;
  content: string;
}
