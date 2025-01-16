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

export const mailboxAPI = {

    createDraft: async (draftData) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/mailbox/create_draft_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(draftData)
            });

            if (!response.ok) {
                throw new Error('Failed to create draft');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating draft:', error);
            throw error;
        }
    },
  
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
    },

    listSentEmails: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/mailbox/list_sent_email');
            if (!response.ok) {
                throw new Error('Failed to fetch sent emails');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching sent emails:', error);
            throw error;
        }
    },

    inboxEmails: async () => {
      try {
          const response = await fetch('http://localhost:3000/api/v1/mailbox/list_inbox_email');
          if (!response.ok) {
              throw new Error('Failed to fetch sent emails');
          }
          return await response.json();
      } catch (error) {
          console.error('Error fetching sent emails:', error);
          throw error;
      }
  },

    updateDraft: async (draftData) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/mailbox/update_draft_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(draftData)
            });

            if (!response.ok) {
                throw new Error('Failed to update draft');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating draft:', error);
            throw error;
        }
    },

    sendEmail: async (emailData) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/mailbox/send_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    listStarredEmails: async() => {
      try {
          const response = await fetch('http://localhost:3000/api/v1/mailbox/list_starred_email');
          if (!response.ok) {
              throw new Error('Failed to fetch starred emails');
          }
          return await response.json();
      } catch (error) {
          console.error('Error fetching starred emails:', error);
          throw error;
      }
    },

    updateStarEmails: async(emailId) => {
      try {
          const response = await fetch(`http://localhost:3000/api/v1/mailbox/star_email/${emailId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
              throw new Error('Failed to update starred emails');
          }
          return await response.json();
      } catch (error) {
          console.error('Error update star emails:', error);
          throw error;
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
