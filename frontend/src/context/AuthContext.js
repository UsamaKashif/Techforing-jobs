import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const login = useCallback(async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      setUser(userData);
      setIsAuthenticated(true);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/auth/verify");
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        logout();
      }
    }
  }, [logout]);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
