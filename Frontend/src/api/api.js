import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});


// Response Interceptor
api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem("refreshToken");

        const response = await axios.post(

          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh-token`,

          {
            token: refreshToken,
          }

        );

        const newAccessToken =
          response.data.accessToken;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      }

      catch (err) {

        localStorage.clear();

        window.location.href = "/auth";

      }

    }

    return Promise.reject(error);

  }

);

export default api;