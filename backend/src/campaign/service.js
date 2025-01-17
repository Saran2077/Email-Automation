import CampaignRepository from "../../utils/repository/Campaign.js";

class CampaignService {
    async create(campaignData) {
        try {
            const campaign = await CampaignRepository.create(campaignData);
            return campaign;
        } catch (error) {
            throw error;
        }
    }
    
    async list(filters={}, page, limit) {
        try {
            const campaign = await CampaignRepository.list(filters, page, limit);
           return campaign;
        } catch (error) {
            throw error;
        }
    }
    
    async getById(filterQuery) {
        try {
            const campaign = await CampaignRepository.findOne(filterQuery);
            return campaign;
        } catch (error) {
            throw error;
        }
    }
    
    async update(filterQuery, updateData) {
        try {
            const campaign = await CampaignRepository.update(filterQuery, updateData);
            return campaign;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(filterQuery) {
        try {
            const campaign = await CampaignRepository.delete(filterQuery);
            return campaign;
        } catch (error) {
            throw error;
        }
    }
}

export default CampaignService