import EmailRepository from "../../utils/repository/Email.js";
import RecipientRepository from "../../utils/repository/Recipient.js";

const emailRepository = new EmailRepository();
class RecipientService {
    async createRecipient(body) {
        return await RecipientRepository.create(body);
    }

    async getRecipient(id, userId) {
        return await RecipientRepository.getById(id, userId);
    }

    async getRecipientByEmail(email, userId) {
        return await RecipientRepository.getByEmail(email, userId);
    }

    async updateRecipient(id, recipient) {
        return await RecipientRepository.updateById(id, recipient);
    }

    async deleteRecipient(id) {
        return await RecipientRepository.delete(id);
    }

    async listRecipients(filters, page, limit) {
        return await RecipientRepository.list(filters, page, limit);
    }

    async bulkCreateRecipients(recipients) {
        return await RecipientRepository.bulkCreate(recipients);
    }

    async getEmailsByRecipient(recipientId, userId) {
        try {
            return await emailRepository.getEmailsByRecipient(recipientId, userId);
        } catch (error) {
            console.error('Service error in getting emails:', error);
            throw error;
        }
    }
}

export default RecipientService;
