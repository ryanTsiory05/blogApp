import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthStorage } from "../services/authService";

export type User = { id: number; username: string };

type AuthContextType = {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
