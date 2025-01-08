import RecipientService from "./service.js";

const recipientService = new RecipientService();

class RecipientHandler {
    
    async createRecipient(req, res, next) {
        try {
            const recipient = await recipientService.createRecipient(req.body);
            res.status(201).json(recipient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecipient(req, res, next) {
        try {
            const recipient = await recipientService.getRecipient(req.params.id);
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
            const recipients = await recipientService.listRecipients();
            res.status(200).json(recipients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async bulkCreateRecipients(req, res, next) {
        try {
            const { recipients } = req.body;
            
            if (!Array.isArray(recipients)) {
                throw new Error('Recipients must be an array');
            }

            if (recipients.length === 0) {
                throw new Error('No recipients provided');
            }

            const createdRecipients = await recipientService.bulkCreateRecipients(recipients);
            res.status(201).json(createdRecipients);
        } catch (error) {
            console.error('Bulk create error:', error);
            res.status(500).json({ error: error.message });
        }
    }

}

export default RecipientHandler;