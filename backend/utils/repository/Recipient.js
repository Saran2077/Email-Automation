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
  async getById(recipientId, userId) {
    try {
      return await Recipient.findOne({ recipientId, createdById: userId })
        .populate('emails.sent')
        .populate('emails.received')
        .populate('emails.starred')
        .populate('emails.drafts');
    } catch (error) {
      throw new Error(`Error fetching recipient: ${error.message}`);
    }
  }

  async getByEmail(email, userId) {
    try {
      return await Recipient.findOne({ email });
    } catch (error) {
      throw new Error(`Error fetching recipient: ${error.message}`);
    }
  }

  // Get all recipients with optional filters
  async list(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = Recipient.find(filters)
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
  async updateById(recipientId, updateData) {
    try {
      const recipient = await Recipient.findOneAndUpdate(
        { _id: String(recipientId) },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      return recipient;
    } catch (error) {
      throw new Error(`Error updating recipient: ${error.message}`);
    }
  }

  async update(query, updateData) {
    try {
      const recipients = await Recipient.findOneAndUpdate(query, updateData);
      return recipients;
    } catch (error) {
      throw new Error(`Error updating recipients: ${error.message}`);
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
  async getByStage(stage) {
    try {
      return await Recipient.find({ stage }).sort({ createdAt: -1 });
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

  // Update recipient metrics
  async updateMetrics(recipientId, metricType, increment = true) {
    try {
      const update = {
        [`metrics.${metricType}`]: increment ? 1 : -1
      };
      
      return await Recipient.findOneAndUpdate(
        { recipientId },
        { $inc: update },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating recipient metrics: ${error.message}`);
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
          { email: { $regex: searchTerm, $options: 'i' } },
          { company: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      return await this.list(query, page, limit);
    } catch (error) {
      throw new Error(`Error searching recipients: ${error.message}`);
    }
  }

  // Bulk create recipients
  async bulkCreate(recipientsData) {
    try {
      return await Recipient.bulkCreateRecipients(recipientsData);
    } catch (error) {
      throw new Error(`Error in bulk creating recipients: ${error.message}`);
    }
  }
}

export default new RecipientRepository();