import EmailRepository from "../../utils/repository/Email.js";
import RecipientRepository from "../../utils/repository/Recipient.js";

const emailRepository = new EmailRepository();
class RecipientService {
    async createRecipient(recipient) {
        return await RecipientRepository.create(recipient);
    }

    async getRecipient(id) {
        return await RecipientRepository.getById(id);
    }

    async getRecipientByEmail(email) {
        return await RecipientRepository.getByEmail(email);
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

    async getEmailsByRecipient(recipientId) {
        try {
            return await emailRepository.getEmailsByRecipient(recipientId);
        } catch (error) {
            console.error('Service error in getting emails:', error);
            throw error;
        }
    }
}

export default RecipientService;
