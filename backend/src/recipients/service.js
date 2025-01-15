import RecipientRepository from "../../utils/repository/Recipient.js";

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

}

export default RecipientService;
