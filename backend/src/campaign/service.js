import CampaignRepository from "../../utils/repository/Campaign.js";

class CampaignService {
    async create(campaignData) {
        try {
            const campaign = await CampaignRepository.create(campaignData);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async list(filters={}, page, limit) {
        try {
            const campaign = await CampaignRepository.list(filters, page, limit);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async getById(campaignId) {
        try {
            const campaign = await CampaignRepository.getById(campaignId);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async update(campaignId, updateData) {
        try {
            const campaign = await CampaignRepository.update(campaignId, updateData);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async delete(campaignId) {
        try {
            const campaign = await CampaignRepository.delete(campaignId);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CampaignService