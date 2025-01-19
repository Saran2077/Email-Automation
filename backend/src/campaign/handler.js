import CampaignService from "./service.js";
import mongoose from 'mongoose';
import JsonWebToken from "../../middleware/jwt.js";
import EmailGenerationService from "../email_generation/service.js";
import EmailService from "../mailbox/service.js";
import RecipientService from "../recipients/service.js";
import { sendMail } from "../../utils/sendMail.js";

const emailGenerationService = new EmailGenerationService();
const recipientService = new RecipientService();
const emailService = new EmailService();
const campaignService = new CampaignService();
const jwt = new JsonWebToken();

class CampaignHandler {
    async create(req, res) {
        try {
            const { body, headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const {data} = body;
            data.createdById = userId;


            // Inline validation
            if (!data) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Campaign data is required'
                });
            }

            if (!data.name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Campaign name is required'
                });
            }

            const campaign = await campaignService.create(data);
            return res.status(201).json({
                status: 'success',
                data: campaign
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Campaign with this ID already exists'
                });
            }

            console.error('Create campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async list(req, res) {
        try {
            const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            // Validate pagination parameters
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            
            if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid pagination parameters'
                });
            }

            const campaignList = await campaignService.list(
                {createdById: userId},
                pageNum,
                limitNum
            );

            return res.status(200).json({
                status: 'success',
                data: campaignList,
                pagination: { page: pageNum, limit: limitNum }
            });
        } catch (error) {
            console.error('List campaigns error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch campaigns',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const filterQuery = { campaignId: id, createdById: userId };

            const campaign = await campaignService.getById(filterQuery);
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: campaign
            });
        } catch (error) {
            console.error('Get campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async getRecipients(req, res) {
        try {
            const { id } = req.params;
            const { headers } = req;
            const { page, ...filter } = req.body;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const filterQuery = { campaignId: id, createdById: userId };

            const campaign = await campaignService.getById(filterQuery);
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            const recipients = await recipientService.listRecipients(filter, page, 10);



            return res.status(200).json({
                status: 'success',
                data: recipients
            });
        } catch (error) {
            console.error('Get campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async addRecipient(req, res) {
        try {
            const { id } = req.params;

            const campaign = await campaignService.getById({ campaignId: id });
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            const { recipientIds } = req.body;

            const updateCampaign = await campaignService.addRecipients(id, recipientIds);


            return res.status(200).json({
                status: 'success',
                data: updateCampaign
            });
        } catch (error) {
            console.error('Get campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async removeRecipient(req, res) {
        try {
            const { id } = req.params;

            const campaign = await campaignService.getById({ campaignId: id });
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            const { recipientIds } = req.body;

            const updateCampaign = await campaignService.removeRecipient(id, recipientIds);


            return res.status(200).json({
                status: 'success',
                data: updateCampaign
            });
        } catch (error) {
            console.error('Get campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async generateEmails(req, res) {
        try {
            const { id } = req.params;

            const campaigns = await campaignService.getById({ campaignId: id });
            
            if (!campaigns) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            const updateCampaign = await campaignService.update({ campaignId: id}, { status: 'Running' });

            res.status(200).json({
                status: 'success',
                data: 'Generating Emails for campaign...'
            });
            
            // Generate emails here using the provided data and Mailgun API
            const generatedEmails = [];
            for (const recipient of campaigns?.recipientsList) {
                const generate_emails = await emailGenerationService.generateEmailWithAI(recipient?.email, campaigns?.promptTemplate);
                console.log(generate_emails);
                generatedEmails.push({ ...generate_emails, name: recipient?.name, email: recipient?.email });
            }
            
            
            const updatedCampaign = await campaignService.update({ campaignId: id}, { status: 'Ready', generatedEmails: generatedEmails });
        } catch (error) {
            console.error('Get campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to generate emails in campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async regenerate(req, res) {
        try {
            const { id } = req.params;
            const { email } = req.body;

            const campaigns = await campaignService.getById({ campaignId: id });
            
            if (!campaigns) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            const updateCampaign = await campaignService.update({ campaignId: id}, { status: 'Running' });

            
            
            const generate_emails = await emailGenerationService.generateEmailWithAI(email, campaigns?.promptTemplate);
            console.log(generate_emails);

            const generatedEmails = campaigns?.generatedEmails?.map((gen) => {
                if (gen?.email === email) {
                    return {...gen, ...generate_emails};
                }
                return gen;
            })

            const updatedCampaign = await campaignService.update({ campaignId: id}, { generatedEmails: generatedEmails });
            
            res.status(200).json({
                status: 'success',
                data: generate_emails
            });
        } catch (error) {
            console.error('Get campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to generate emails in campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async sendEmails(req, res) {
        try {
            const { id } = req.params;

            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;

            const campaigns = await campaignService.getById({ campaignId: id });
            
            if (!campaigns) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            const updateCampaign = await campaignService.update({ campaignId: id}, { status: 'Sending' });

            res.status(200).json({
                status: 'success',
                data: 'Sending Emails for campaign...'
            });
            
            // Send emails here using the provided data and Mailgun API
            for (const campaign of campaigns?.generatedEmails || []) {
                const emailSendResp = await sendMail({
                    from: "betagamer580@gmail.com",
                    to: campaign.email,
                    subject: campaign.subject,
                    body: campaign.body
                })

                const storeSentMail = await emailService.sendEmail(null, campaign.subject, campaign.body, campaign?.email, "betagamer580@gmail.com", null, emailSendResp, userId);
            }
            
            
            const updatedCampaign = await campaignService.update({ campaignId: id}, { status: 'Idle', generatedEmails: [] });
        } catch (error) {
            console.error('Send Emails in Campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to Send Emails in Campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const filterQuery = { campaignId: id, createdById: userId };

            if (data.recipientsList) {
                const hasInvalidIds = data.recipientsList.some(
                    rid => !mongoose.Types.ObjectId.isValid(rid)
                );
                if (hasInvalidIds) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid recipient ID(s) in recipients list'
                    });
                }
            }

            const campaign = await campaignService.update(filterQuery, data);
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: campaign
            });
        } catch (error) {
            console.error('Update campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const filterQuery = { campaignId: id, createdById: userId };

            const campaign = await campaignService.delete(filterQuery);
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Campaign deleted successfully'
            });
        } catch (error) {
            console.error('Delete campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }
}

export default CampaignHandler;