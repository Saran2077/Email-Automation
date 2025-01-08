import { Recipient } from '../models/Recipient.js';

class RecipientRepository {
  // Create a new recipient
  async create(recipientData) {
    try {
      const recipient = new Recipient(recipientData);
      return await recipient.save();
    } catch (error) {
      throw new Error(`Error creating recipient: ${error.message}`);
    }
  }

  // Get a recipient by ID
  async getById(recipientId) {
    try {
      return await Recipient.findOne({ recipientId })
        .populate('campaigns.campaign')
        .populate('emails.sent')
        .populate('emails.received')
        .populate('emails.starred')
        .populate('emails.drafts');
    } catch (error) {
      throw new Error(`Error fetching recipient: ${error.message}`);
    }
  }

  // Get all recipients with optional filters
  async list(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = Recipient.find(filters)
        .populate('campaigns.campaign')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const [recipients, total] = await Promise.all([
        query.exec(),
        Recipient.countDocuments(filters)
      ]);

      return {
        recipients,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error listing recipients: ${error.message}`);
    }
  }

  // Update a recipient
  async update(recipientId, updateData) {
    try {
      const recipient = await Recipient.findOneAndUpdate(
        { recipientId },
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('campaigns.campaign');

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      return recipient;
    } catch (error) {
      throw new Error(`Error updating recipient: ${error.message}`);
    }
  }

  // Delete a recipient
  async delete(recipientId) {
    try {
      const recipient = await Recipient.findOneAndDelete({ recipientId });
      if (!recipient) {
        throw new Error('Recipient not found');
      }
      return recipient;
    } catch (error) {
      throw new Error(`Error deleting recipient: ${error.message}`);
    }
  }

  // Get recipients by stage
  async getByStage(stage, page = 1, limit = 10) {
    try {
      return await this.list({ stage }, page, limit);
    } catch (error) {
      throw new Error(`Error fetching recipients by stage: ${error.message}`);
    }
  }

  // Update recipient stage
  async updateStage(recipientId, newStage) {
    try {
      return await this.update(recipientId, { stage: newStage });
    } catch (error) {
      throw new Error(`Error updating recipient stage: ${error.message}`);
    }
  }

  // Add recipient to campaign
  async addToCampaign(recipientId, campaignId) {
    try {
      const recipient = await Recipient.findOneAndUpdate(
        { recipientId },
        {
          $addToSet: {
            campaigns: {
              campaign: campaignId,
              status: 'pending'
            }
          }
        },
        { new: true }
      ).populate('campaigns.campaign');

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      return recipient;
    } catch (error) {
      throw new Error(`Error adding recipient to campaign: ${error.message}`);
    }
  }

  // Remove recipient from campaign
  async removeFromCampaign(recipientId, campaignId) {
    try {
      const recipient = await Recipient.findOneAndUpdate(
        { recipientId },
        {
          $pull: {
            campaigns: {
              campaign: campaignId
            }
          }
        },
        { new: true }
      ).populate('campaigns.campaign');

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      return recipient;
    } catch (error) {
      throw new Error(`Error removing recipient from campaign: ${error.message}`);
    }
  }

  // Update recipient's campaign status
  async updateCampaignStatus(recipientId, campaignId, status) {
    try {
      const recipient = await Recipient.findOneAndUpdate(
        { 
          recipientId,
          'campaigns.campaign': campaignId
        },
        {
          $set: {
            'campaigns.$.status': status
          }
        },
        { new: true }
      ).populate('campaigns.campaign');

      if (!recipient) {
        throw new Error('Recipient or campaign association not found');
      }

      return recipient;
    } catch (error) {
      throw new Error(`Error updating campaign status: ${error.message}`);
    }
  }

  // Bulk update recipients
  async bulkUpdate(recipientIds, updateData) {
    try {
      const result = await Recipient.updateMany(
        { recipientId: { $in: recipientIds } },
        { $set: updateData }
      );

      return result;
    } catch (error) {
      throw new Error(`Error performing bulk update: ${error.message}`);
    }
  }

  // Search recipients
  async search(searchTerm, page = 1, limit = 10) {
    try {
      const query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      return await this.list(query, page, limit);
    } catch (error) {
      throw new Error(`Error searching recipients: ${error.message}`);
    }
  }
}

export default new RecipientRepository();
