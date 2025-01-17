import CampaignRepository from "../../utils/repository/Campaign.js";

class CampaignService {
    async create(campaignData) {
        try {
            const campaign = await CampaignRepository.create(campaignData);
            return campaign;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async list(filters={}, page, limit) {
        try {
            const campaign = await CampaignRepository.list(filters, page, limit);
            return campaign;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async getById(campaignId) {
        try {
            const campaign = await CampaignRepository.getById(campaignId);
            return campaign;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async update(campaignId, updateData) {
        try {
            const campaign = await CampaignRepository.update(campaignId, updateData);
            return campaign;
        } catch (error) {
            throw new Error(error);
        }
    }

    async addRecipients(campaignId, recipientIds) {
        try {
            const campaign = await CampaignRepository.addRecipients(campaignId, recipientIds);
            return campaign;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async delete(campaignId) {
        try {
            const campaign = await CampaignRepository.delete(campaignId);
            return campaign;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default CampaignService