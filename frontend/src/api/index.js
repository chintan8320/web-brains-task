import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false 
});

API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getById: (id) => API.get(`/categories/${id}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
  updateStatus: (id, status) => API.patch(`/categories/${id}/status`, { status })
};

export const expenseTypeAPI = {
    getAll: () => API.get('/expense-types'),
    getById: (id) => API.get(`/expense-types/${id}`),
    create: (data) => API.post('/expense-types', data),
    update: (id, data) => API.put(`/expense-types/${id}`, data),
    delete: (id) => API.delete(`/expense-types/${id}`),
    updateStatus: (id, status) => API.patch(`/expense-types/${id}/status`, { status })
  };


export default API;