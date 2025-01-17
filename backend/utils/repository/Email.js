import { Email } from '../models/Email.js';
import { Recipient } from '../models/Recipient.js';

class EmailRepository {
  // Create a new email
  async create(emailData) {
    try {
      return await Email.create(emailData)
    } catch (error) {
      throw new Error(`Error creating email: ${error.message}`);
    }
  }

  async countDocuments(filter = {}) {
    return await Email.countDocuments(filter)
}

  // Get an email by ID
  async getById(emailId) {
    try {
      return await Email.findOne({ emailId })
        .populate('to')
    } catch (error) {
      throw new Error(`Error fetching email: ${error.message}`);
    }
  }

  async get(query) {
    try {
      return await Email.findOne({ ...query })
        .populate('to')
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
  async update(query, updateData) {
    try {
      const email = await Email.findOneAndUpdate(
        { ...query },
        { $set: updateData },
        { 
          new: true,
          runValidators: true,
          populate: [
            { path: 'to' }
          ]
        }
      );

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
  async toggleStarred(emailId, userId) {
    try {
      const email = await Email.findOne({ emailId, createdById: userId });
      if (!email) {
        throw new Error('Email not found');
      }

      email.isStarred = !email.isStarred;
      return await email.save();
    } catch (error) {
      throw new Error(`Error toggling starred status: ${error.message}`);
    }
  }

  async getEmailsByRecipient(recipientId, userId) {
    try {
        const recipient = await Recipient.findOne({ recipientId, createdById: userId });
        if (!recipient) {
            throw new Error('Recipient not found');
        }

        const emails = await Email.find({
            $or: [
                { to: recipient._id },  // Using MongoDB _id
            ]
        })
        .populate('to', 'name email')  // Populate recipient details
        .sort({ createdAt: -1 })
        .select('subject body status createdAt messageId isStarred isDraft isSent isReceived');

        return {
            recipient: {
                id: recipient.recipientId,
                name: recipient.name,
                email: recipient.email
            },
            emails: emails.map(email => ({
                ...email.toObject(),
                type: email.isSent ? 'sent' : 
                      email.isReceived ? 'received' : 
                      email.isDraft ? 'draft' : 'unknown'
            }))
        };
    } catch (error) {
        throw new Error(`Error fetching emails by recipient: ${error.message}`);
    }
  }
}

export default EmailRepository
