import api from "./api";

type LoginResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};
export const register = (data: {
  username: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
