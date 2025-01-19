import { Campaign } from '../models/Campaign.js';

class CampaignRepository {
  // Create a new campaign
  async create(campaignData) {
    try {
      const campaign = new Campaign(campaignData);
      return await campaign.save();
    } catch (error) {
      throw new Error(`Error creating campaign: ${error.message}`);
    }
  }

  // Get a campaign by ID
  async getById(filterQuery) {
    try {
      return await Campaign.findOne({ ...filterQuery }).populate('recipientsList');
    } catch (error) {
      throw new Error(`Error fetching campaign: ${error.message}`);
    }
  }

  // Get all campaigns with optional filters
  async list(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = Campaign.find(filters)
        .populate('recipientsList')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const [campaigns, total] = await Promise.all([
        query.exec(),
        Campaign.countDocuments(filters)
      ]);

      return {
        campaigns,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error listing campaigns: ${error.message}`);
    }
  }

  // Update a campaign
  async update(campaignId, updateData) {
    try {
      const campaign = await Campaign.findOneAndUpdate(
        { ...campaignId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!campaign) {
        throw new Error('Campaign not found');
      }
      return campaign;
    } catch (error) {
      throw new Error(`Error updating campaign: ${error.message}`);
    }
  }

  // Delete a campaign
  async delete(filterQuery) {
    try {
      const campaign = await Campaign.findOneAndDelete(filterQuery);
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      return campaign;
    } catch (error) {
      throw new Error(`Error deleting campaign: ${error.message}`);
    }
  }

  // Add recipients to campaign
  async addRecipients(campaignId, recipientIds) {
    try {
      const campaign = await Campaign.findOneAndUpdate(
        { campaignId },
        { $addToSet: { recipientsList: { $each: recipientIds } } },
        { new: true }
      );

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      return campaign;
    } catch (error) {
      throw new Error(`Error adding recipients: ${error.message}`);
    }
  }

  // Remove recipients from campaign
  async removeRecipients(campaignId, recipientIds) {
    try {
      const campaign = await Campaign.findOneAndUpdate(
        { campaignId },
        { $pullAll: { recipientsList: recipientIds } },
        { new: true }
      ).populate('recipientsList');

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      return campaign;
    } catch (error) {
      throw new Error(`Error removing recipients: ${error.message}`);
    }
  }
}

export default new CampaignRepository();
