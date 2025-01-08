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
  fetchCustomers: async () => {
    try {
      const response = await api.get('/scrap');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const mailboxAPI = {
    listDrafts: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/mailbox/list_draft_email', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch draft emails');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching draft emails:', error);
            throw error;
        }
    }
};
