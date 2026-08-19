import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://particularistically-transelementary-owen.ngrok-free.dev/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pixycar_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Centralized response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

