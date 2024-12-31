import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token gönderiliyor:', config.headers.Authorization);
  } else {
    console.log('Token bulunamadı');
  }
  return config;
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/users/login', {
      username: username,
      password: password
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      console.log('Token kaydedildi:', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    
    if (error.response?.data) {
      if (Array.isArray(error.response.data)) {
        throw new Error(error.response.data[0]?.msg || 'Login failed');
      } else if (typeof error.response.data === 'object') {
        throw new Error(error.response.data.detail || 'Login failed');
      } else {
        throw new Error(error.response.data || 'Login failed');
      }
    }
    throw new Error('Network error occurred');
  }
};

export const getArticles = async () => {
  try {
    const response = await api.get('/articles');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createArticle = async (articleData) => {
  try {
    const response = await api.post('/articles', articleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserProfile = async () => {
  try {
    console.log('API: Kullanıcı profili isteği gönderiliyor...');
    const response = await api.get('/users/me');
    console.log('API: Kullanıcı profili yanıtı:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Hatası:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/me', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    const response = await api.delete(`/articles/${articleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateArticle = async (articleId, articleData) => {
  try {
    const response = await api.put(`/articles/${articleId}`, articleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getArticleById = async (articleId) => {
  try {
    const response = await api.get(`/articles/${articleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;