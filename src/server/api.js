import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const taskService = {
  getAll: () => api.get('/tasks'),
  create: (task) => api.post('/tasks', task),
  update: (id, task) => api.put(`/tasks/${id}`, task),
  delete: (id) => api.delete(`/tasks/${id}`),
  search: (query) => api.get(`/tasks/search?q=${encodeURIComponent(query)}`),
  getOverdue: () => api.get('/overdue')
};

export const tagService = {
  getAll: () => api.get('/tags'),
  create: (tag) => api.post('/tags', tag),
  delete: (id) => api.delete(`/tags/${id}`)
};

export const storageService = {
  saveTheme: (theme) => localStorage.setItem('theme', theme),
  getTheme: () => localStorage.getItem('theme') || 'light',
  saveData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  getData: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};