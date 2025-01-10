import RecipientRepository from "../../utils/repository/Recipient.js";

class RecipientService {
    async createRecipient(recipient) {
        return await RecipientRepository.create(recipient);
    }

    async getRecipient(id) {
        return await RecipientRepository.getById(id);
    }

    async updateRecipient(id, recipient) {
        return await RecipientRepository.updateById(id, recipient);
    }

    async deleteRecipient(id) {
        return await RecipientRepository.delete(id);
    }

    async listRecipients() {
        return await RecipientRepository.list();
    }

    async bulkCreateRecipients(recipients) {
        return await RecipientRepository.bulkCreate(recipients);
    }

}

export default RecipientService;
