const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
};
