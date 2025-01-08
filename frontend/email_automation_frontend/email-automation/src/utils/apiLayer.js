import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const recipientAPI = {
  create: async (data) => {
    try {
      const response = await api.post('/v1/recipients/create', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  list: async () => {
    try {
      const response = await api.get('/v1/recipients/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.post(`/v1/recipients/update/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  bulkCreate: async (data) => {
    try {
      const response = await api.post('/v1/recipients/bulk-create', {
        recipients: Array.isArray(data) ? data : [data]
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const scrapAPI = {
  fetchCustomers: async (filters) => {
    try {
      const response = await api.post('/scrap', filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}
;
export const dashboardAPI = {
  metrics: async () => {
    try {
      const response = await api.get('/v1/dashboard');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
