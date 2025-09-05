import { apiRequest } from "./api";

export const signup = (userData) =>
  apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const login = (credentials) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
