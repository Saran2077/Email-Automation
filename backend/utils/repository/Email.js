import { Email } from '../models/Email.js';

class EmailRepository {
  // Create a new email
  async create(emailData) {
    try {
      return await Email.create(emailData)
    } catch (error) {
      throw new Error(`Error creating email: ${error.message}`);
    }
  }

  // Get an email by ID
  async getById(emailId) {
    try {
      return await Email.findOne({ emailId })
        .populate('from')
        .populate('to')
        .populate('campaign');
    } catch (error) {
      throw new Error(`Error fetching email: ${error.message}`);
    }
  }

  // Get all emails with optional filters
  async list(filters = {}) {
    try {
    
      const query = Email.find(filters)
        .populate('to')
        .sort({ createdAt: -1 })
      

      const [emails, total] = await Promise.all([
        query.exec(),
        Email.countDocuments(filters)
      ]);

      return {
        emails,
        total
      };
    } catch (error) {
      throw new Error(`Error listing emails: ${error.message}`);
    }
  }

  // Update an email
  async update(emailId, updateData) {
    try {
      const email = await Email.findOneAndUpdate(
        { emailId },
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate('from')
        .populate('to')
        .populate('campaign');

      if (!email) {
        throw new Error('Email not found');
      }

      return email;
    } catch (error) {
      throw new Error(`Error updating email: ${error.message}`);
    }
  }

  // Delete an email
  async delete(emailId) {
    try {
      const email = await Email.findOneAndDelete({ emailId });
      if (!email) {
        throw new Error('Email not found');
      }
      return email;
    } catch (error) {
      throw new Error(`Error deleting email: ${error.message}`);
    }
  }

  // Get emails by recipient
  async getRecipientEmails(recipientId, type = 'received', page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      switch (type) {
        case 'sent':
          query.from = recipientId;
          break;
        case 'received':
          query.to = recipientId;
          break;
        case 'starred':
          query.to = recipientId;
          query.isStarred = true;
          break;
        case 'drafts':
          query.from = recipientId;
          query.isDraft = true;
          break;
        default:
          throw new Error('Invalid email type');
      }

      const [emails, total] = await Promise.all([
        Email.find(query)
          .populate('from')
          .populate('to')
          .populate('campaign')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Email.countDocuments(query)
      ]);

      return {
        emails,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error fetching recipient emails: ${error.message}`);
    }
  }

  // Toggle starred status
  async toggleStarred(emailId) {
    try {
      const email = await Email.findOne({ emailId });
      if (!email) {
        throw new Error('Email not found');
      }

      email.isStarred = !email.isStarred;
      return await email.save();
    } catch (error) {
      throw new Error(`Error toggling starred status: ${error.message}`);
    }
  }
}

export default EmailRepository
