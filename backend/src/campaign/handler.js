import CampaignService from "./service.js";
import mongoose from 'mongoose';

const campaignService = new CampaignService();

class CampaignHandler {
    async create(req, res) {
        try {
            const { data } = req.body;
            
            // Inline validation
            if (!data) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Campaign data is required'
                });
            }

            if (!data.name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Campaign name is required'
                });
            }

            if (!data.recipientsList?.length) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Recipients list is required and must not be empty'
                });
            }

            const campaign = await campaignService.create(data);
            return res.status(201).json({
                status: 'success',
                data: campaign
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Campaign with this ID already exists'
                });
            }

            console.error('Create campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async list(req, res) {
        try {
            const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
            
            // Validate pagination parameters
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            
            if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid pagination parameters'
                });
            }

            const campaignList = await campaignService.list(
                {},
                pageNum,
                limitNum
            );

            return res.status(200).json({
                status: 'success',
                data: campaignList,
                pagination: { page: pageNum, limit: limitNum }
            });
        } catch (error) {
            console.error('List campaigns error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch campaigns',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const campaign = await campaignService.getById(id);
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: campaign
            });
        } catch (error) {
            console.error('Get campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { data } = req.body;

            if (data.recipientsList) {
                const hasInvalidIds = data.recipientsList.some(
                    rid => !mongoose.Types.ObjectId.isValid(rid)
                );
                if (hasInvalidIds) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid recipient ID(s) in recipients list'
                    });
                }
            }

            const campaign = await campaignService.update(id, data);
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: campaign
            });
        } catch (error) {
            console.error('Update campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            
            const campaign = await campaignService.delete(id);
            
            if (!campaign) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Campaign not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Campaign deleted successfully'
            });
        } catch (error) {
            console.error('Delete campaign error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete campaign',
                ...(process.env.NODE_ENV === 'development' && { detail: error.message })
            });
        }
    }
}

export default CampaignHandler;