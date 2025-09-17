import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/jwt/create/") &&
            !originalRequest.url.includes("/auth/jwt/refresh/")
        ) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await api.post("/auth/jwt/refresh/", {});
                const newAccess = refreshResponse.data.access;

                localStorage.setItem("accessToken", newAccess);
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;