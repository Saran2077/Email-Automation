import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Make sure to add the 'Bearer ' prefix
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// API services
export const authAPI = {
  getProfileInfo: async () => {
    try {
      const response = await api.get('/v1/auth/get-profile-info');
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  getSettingsInfo: async () => {
    try {
      const response = await api.get('/v1/auth/get-settings-info');
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Helper method to check if token is valid
  validateToken: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Basic JWT expiry check
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }
};

export const recipientAPI = {
  create: async (data) => {
    try {
      const response = await api.post('/v1/recipients/create', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  list: async (params) => {
    try {
      const response = await api.get('/v1/recipients/list', {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/v1/recipients/get/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMetrics: async (id) => {
    try {
      const response = await api.get(`/v1/recipients/metrics/${id}`);
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

  updateStage: async (id, data) => {
    try {
      const response = await api.post(`/v1/recipients/update_stage/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  bulkCreate: async ({recipients, template}) => {
    try {
      const response = await api.post('/v1/recipients/bulk-create', {
        recipients: Array.isArray(recipients) ? recipients : [recipients],
        template: Array.isArray(template) ? template[0] : template
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEmailHistory: async (recipientId) => {
    try {
      const response = await api.get(`/v1/recipients/emails/${recipientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email history:', error);
      throw error;
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
  },
  fetchFilteredCustomers: async (prompt) => {
    try {
      const response = await api.post('/scrap/prompt', { prompt });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const campaignAPI = {
  list: async (filters={}) => {
    try {
      const response = await api.post('/v1/campaign', filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/v1/campaign/create', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.post(`/v1/campaign/update/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (id, data) => {
    try {
      const response = await api.post(`/v1/campaign/add/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

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

export const mailboxAPI = {

    createDraft: async (draftData) => {
        try {
            const response = await api.post('/v1/mailbox/create_draft_email', draftData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    listDrafts: async () => {
        try {
            const response = await api.get('/v1/mailbox/list_draft_email');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    listSentEmails: async () => {
        try {
            const response = await api.get('/v1/mailbox/list_sent_email');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    inboxEmails: async () => {
      try {
          const response = await api.get('/v1/mailbox/list_inbox_email');
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  },

    updateDraft: async (draftData) => {
        try {
            const response = await api.post('/v1/mailbox/update_draft_email', draftData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    sendEmail: async (emailData) => {
        try {
            const response = await api.post('/v1/mailbox/send_email', emailData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    listStarredEmails: async() => {
      try {
          const response = await api.get('/v1/mailbox/list_starred_email');
          return response.data;
      } catch (error) {
          console.error('Error fetching starred emails:', error);
          throw error;
      }
    },

    updateStarEmails: async(emailId) => {
      try {
          const response = await api.post(`/v1/mailbox/star_email/${emailId}`);
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
    },  
    
    generateEmailWithAI: async (payload) => {
        try {
            const response = await api.post('/v1/email_generation/generate_email_with_ai', payload);
            return response.data;
        } catch (error) {
            console.error('Error in generateEmailWithAI:', error);
            throw error;
        }
    },

    getEmail: async (emailId) => {
      try {
        const response = await api.get(`/v1/mailbox/${emailId}`);
        if (!response?.data?.success) throw new Error('Failed to fetch email');

        return response?.data?.data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
};

export const promptAPI = {
    getPromptTemplate: async (recipientEmail) => {
        try {
            const response = await api.get(`/v1/email_generation/get_prompt_template/${recipientEmail}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching prompt template:', error);
            throw error;
        }
    },

    updatePromptTemplate: async (recipientEmail, data) => {
      try {
        const response = await api.post(`/v1/email_generation/update_prompt_template/${recipientEmail}`, data);
        return response.data;
    } catch (error) {
        console.error('Error generating email:', error);
        throw error;
    }
    },

    generateEmail: async (toEmail, customContext) => {
        try {
            const response = await api.post('/v1/email_generation/generate_email_with_ai', {
                toEmail,
                customContext
            });
            return response.data;
        } catch (error) {
            console.error('Error generating email:', error);
            throw error;
        }
    }
};
