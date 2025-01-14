import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Login sayfasındayken 401 hatasını yönlendirme yapmadan geç
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error.response?.data || error);
    }
);

// Auth functions
export const login = async (username, password) => {
    try {
        const response = await api.post('/users/login', {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await api.post('/users/register', {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// User functions
export const getUserProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
};

export const updatePassword = async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
};

// Article functions
export const getArticlesFeed = async () => {
    const response = await api.get('/articles/feed');
    return response.data;
};

export const getArticleById = async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
};

export const createArticle = async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
};

export const updateArticle = async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
};

export const deleteArticle = async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
};

export const getMyArticles = async () => {
    const response = await api.get('/articles/my-articles');
    return response.data;
};

// Saved Articles endpoints
export const saveArticle = async (articleId) => {
    const response = await api.post(`/saved-articles/${articleId}`);
    return response.data;
};

export const unsaveArticle = async (articleId) => {
    const response = await api.delete(`/saved-articles/${articleId}`);
    return response.data;
};

export const getSavedArticles = async () => {
    const response = await api.get('/saved-articles');
    return response.data;
};

export const checkIfArticleSaved = async (articleId) => {
    const response = await api.get(`/saved-articles/${articleId}/is-saved`);
    return response.data.is_saved;
};

export const chatWithArticle = async (articleId, message) => { //id alacak
    try {
        const response = await api.post(`/articles/${articleId}/chat`, {
            message: message
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;