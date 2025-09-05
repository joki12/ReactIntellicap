import { apiRequest } from "./queryClient";

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    return res.json();
  },
  
  register: async (name: string, email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/register", { name, email, password });
    return res.json();
  },
  
  me: async (token: string) => {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to get user");
    return res.json();
  }
};

export const getAuthHeaders = (token: string | null) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};
