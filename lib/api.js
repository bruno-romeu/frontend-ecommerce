import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
            !originalRequest.url?.includes('/auth/jwt/create/') &&
            !originalRequest.url?.includes('/auth/jwt/refresh/')
        ) {
            originalRequest._retry = true;

            try {
                // Tenta fazer refresh (backend usa refresh token do cookie)
                // O novo access token voltará como cookie também
                await api.post('/auth/jwt/refresh/', {});
                
                // Retry da requisição original
                // O cookie já está atualizado automaticamente
                return api(originalRequest);
            } catch (refreshError) {
                // Se refresh falhar, redireciona para login
                console.error('Refresh token expirado ou inválido');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;