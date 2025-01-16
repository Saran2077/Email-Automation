import CampaignService from "./service.js";

const campaignService = new CampaignService();



class DashboardHandler {
    async create(req, res, next) {
        try {
            const { data } = req.body;
            const campaign = await campaignService.create(data);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async list(req, res, next) {
        try {
            const { params } = req.body;
            const campaignList = await campaignService.list();
            res.status(201).json({ data: campaignList });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const campaign = await campaignService.getById(id);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            const campaign = await campaignService.update(id, data);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const campaign = await campaignService.delete(id);
            res.status(201).json({ data: campaign });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default DashboardHandler;