import EmailRepository from "../../utils/repository/Email.js";
import DashboardService from "../dashboard/service.js";
import { getAllCustomFields, getContactsData, updateContact } from "../services/activeCampaign.js";
import RecipientService from "./service.js";
import EmailGenerationService from "../email_generation/service.js";
import JsonWebToken from "../../middleware/jwt.js";

const recipientService = new RecipientService();
const emailService = new EmailRepository();
const emailGenerationService = new EmailGenerationService();
const jwt = new JsonWebToken();

class RecipientHandler {
    
    async createRecipient(req, res, next) {
        try {
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const {body} = req;
            body.createdById = userId;
            const recipient = await recipientService.createRecipient(body);
            res.status(201).json(recipient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecipient(req, res, next) {
        try {
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const recipient = await recipientService.getRecipient(req.params.id, userId);
            res.status(200).json(recipient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecipientByEmail(req, res, next) {
        try {
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const recipient = await recipientService.getRecipientByEmail(req.params.email, userId);
            res.status(200).json(recipient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateRecipient(req, res, next) {
        try {
            const recipient = await recipientService.updateRecipient(req.params.id, req.body);
            res.status(200).json(recipient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateRecipientStage(req, res, next) {
        try {
            const { id } = req.params;
            const { email, stage } = req.body;
            const recipient = await recipientService.updateRecipient(id, { stage });

            res.status(200).json(recipient);

            const customFields = await getAllCustomFields();

            const field = customFields?.fields?.find(field => field.title === 'Stage')
            if (field) {
                const contact = await getContactsData({ email });
                if (contact?.contacts?.length > 0) {
                    const id = contact.contacts?.[0]?.id;
                    await updateContact(id, { fieldValues:
                        [{
                            field: field?.id,
                            value: stage
                        }]
                    });
                }
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteRecipient(req, res, next) {
        try {
            await recipientService.deleteRecipient(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listRecipients(req, res, next) {
        try {
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const { page = 1, limit = 10, search, stage } = req.query;
            const filters = { createdById: userId };
    
            // Add search filter for name, email, and company using MongoDB $or operator
            if (search) {
                filters.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } }
                ];
            }
    
            // Add stage filter
            if (stage && stage !== 'all') {
                filters.stage = stage;
            }
    
            const recipients = await recipientService.listRecipients(filters, page, limit);
            res.status(200).json(recipients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecipientMetrics(req, res, next) {
        try {
            const { emailId } = req.params;
            const recipient = await recipientService.getRecipient(emailId);

            if (!recipient) {
                return res.status(404).json({
                    success: false,
                    message: `Recipient not found with email ID: ${emailId}`
                })
            }
            const opened = await emailService.countDocuments({
                status: 'opened'
              });
          
              // Get clicked count from status array
              const clicked = await emailService.countDocuments({
                status: 'clicked'
              });
          
              // Get failed count combining hard and soft bounces
              const failed = await emailService.countDocuments({
                $or: [
                  { status: 'hard-bounced' },
                  { status: 'soft-bounced' },
                  { isFailed: true }
                ]
              });
          
              // Get complaints count from status
              const complaints = await emailService.countDocuments({
                status: 'complaints'
              });
              
              const metrics =  {
                opened,
                clicked,
                failed,
                complaints
              };

              console.log(metrics);
            res.status(200).json({ success: true, metrics});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async bulkCreateRecipients(req, res, next) {
        try {
            const { recipients, template } = req.body;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const recipientsWithUserId = recipients.map(recipient => ({ ...recipient, createdById: userId }));  
            if (!Array.isArray(recipientsWithUserId)) {
                throw new Error('Recipients must be an array');
            }

            if (recipientsWithUserId.length === 0) {
                throw new Error('No recipients provided');
            }

            const createdRecipients = await recipientService.bulkCreateRecipients(recipientsWithUserId);
            console.log(createdRecipients);
            //from created recipients iterate over each recipient and store the recipientId in one variable
            const recipientIds = createdRecipients.map(recipient => recipient.recipientId);
            // console.log(recipientIds);
            const promptTemplateCreation = await emailGenerationService.promptTemplateCreation(recipientIds, template);
            // console.log(promptTemplateCreation);
            res.status(201).json({ createdRecipients, promptTemplateCreation });
        } catch (error) {
            console.error('Bulk create error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getEmailsByRecipient(req, res, next) {
        try {
            const { id } = req.params;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const emails = await recipientService.getEmailsByRecipient(id, userId);
            res.status(200).json(emails);
        } catch (error) {
            console.error('Error fetching emails by recipient:', error);
            res.status(500).json({ error: error.message });
        }
    }

}

export default RecipientHandler;