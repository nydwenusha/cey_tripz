import axios from "axios";

const api = axios.create({
  baseURL: "https://unmagnanimous-tristian-disagreeably.ngrok-free.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// List of public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/contact",
  "/about",
  // Add other public routes here
];

api.interceptors.request.use(
  (config) => {
    // Check if the current URL is a public route
    const isPublicRoute = publicRoutes.some((route) =>
      config.url.includes(route),
    );

    // Only add token for non-public routes
    if (!isPublicRoute) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for 401 errors on non-public routes
    if (error.response?.status === 401) {
      const isPublicRoute = publicRoutes.some((route) =>
        error.config?.url?.includes(route),
      );

      if (!isPublicRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
