import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000'
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
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth functions
export const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:8000/users/login', {
            username,
            password
        });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await axios.post('http://localhost:8000/users/register', {
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

export default api;