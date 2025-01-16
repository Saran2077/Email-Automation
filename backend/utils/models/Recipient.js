import mongoose from 'mongoose';
import { Counter } from './Counter.js';

const recipientSchema = new mongoose.Schema({
  recipientId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  company: {
    type: String,

  },
  country: {
    type: String,
    
  },
  city: {
    type: String,
    
  },
  state: {
    type: String,
    
  },
  designation: {
    type: String,
    
  },
  linkedinHandle: {
    type: String,
    
  },
  companyDomain: {
    type: String,
    
  },
  shortBio: {
    type: String,
    
  },
  industry: {
    type: String,
    
  },
  Description: {
    type: String,
    
  },
  stage: {
    type: String,
    enum: ['Contact', 'Lead', 'Deal', 'Account'],
    default: 'Contact'
  },
  metrics: {
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  //notes
  notes: {
    type: [{
      content: {
          type: String,
          required: true
      },
      createdAt: {
          type: Date,
          default: Date.now
      }
  }],
  default: []
  },
  // Email tracking
  emails: {
    sent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Email'
    }],
    received: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Email'
    }],
    starred: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Email'
    }],
    drafts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Email'
    }]
  }
}, {
  timestamps: true
});

// Pre-save middleware to auto-increment recipientId
recipientSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'recipientId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.recipientId = counter.seq;
  }
  next();
});

// Add static method for bulk creation
recipientSchema.statics.bulkCreateRecipients = async function(recipientsData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const recipients = [];
    
    // Get the current counter value
    let counter = await Counter.findById('recipientId').session(session) || { seq: 0 };
    
    // Prepare all recipients with incremented IDs
    for (const data of recipientsData) {
      counter.seq += 1;
      recipients.push(new this({
        ...data,
        recipientId: counter.seq
      }));
    }

    // Update the counter
    await Counter.findByIdAndUpdate(
      'recipientId',
      { seq: counter.seq },
      { session, upsert: true }
    );

    // Save all recipients
    const savedRecipients = await this.insertMany(recipients, { session });
    
    await session.commitTransaction();
    return savedRecipients;
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`Error in bulk creating recipients: ${error.message}`);
  } finally {
    session.endSession();
  }
};

// Add these methods to the recipientSchema
recipientSchema.methods.getEmailHistory = async function() {
    try {
        // Populate all email references with relevant fields
        const recipient = await this.populate([
            {
                path: 'emails.sent',
                select: 'subject body status createdAt messageId isStarred',
                options: { sort: { createdAt: -1 } }
            },
            {
                path: 'emails.received',
                select: 'subject body status createdAt messageId isStarred',
                options: { sort: { createdAt: -1 } }
            },
            {
                path: 'emails.starred',
                select: 'subject body status createdAt messageId isStarred',
                options: { sort: { createdAt: -1 } }
            },
            {
                path: 'emails.drafts',
                select: 'subject body status createdAt messageId isDraft',
                options: { sort: { createdAt: -1 } }
            }
        ]);

        // Combine and format all emails
        const allEmails = [
            ...(recipient.emails.sent || []).map(email => ({
                ...email.toObject(),
                type: 'sent'
            })),
            ...(recipient.emails.received || []).map(email => ({
                ...email.toObject(),
                type: 'received'
            })),
            ...(recipient.emails.drafts || []).map(email => ({
                ...email.toObject(),
                type: 'draft'
            }))
        ];

        // Sort by date
        return allEmails.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
        console.error('Error fetching email history:', error);
        throw error;
    }
};

// Static method to get recipient with email history
recipientSchema.statics.getRecipientWithEmailHistory = async function(recipientId) {
    try {
        const recipient = await this.findOne({ recipientId })
            .populate([
                {
                    path: 'emails.sent',
                    select: 'subject body status createdAt messageId isStarred',
                    options: { sort: { createdAt: -1 } }
                },
                {
                    path: 'emails.received',
                    select: 'subject body status createdAt messageId isStarred',
                    options: { sort: { createdAt: -1 } }
                },
                {
                    path: 'emails.starred',
                    select: 'subject body status createdAt messageId isStarred',
                    options: { sort: { createdAt: -1 } }
                },
                {
                    path: 'emails.drafts',
                    select: 'subject body status createdAt messageId isDraft',
                    options: { sort: { createdAt: -1 } }
                }
            ]);

        if (!recipient) {
            throw new Error('Recipient not found');
        }

        const emailHistory = await recipient.getEmailHistory();
        return {
            recipient: recipient.toObject(),
            emailHistory
        };
    } catch (error) {
        console.error('Error fetching recipient with email history:', error);
        throw error;
    }
};

export const Recipient = mongoose.model('Recipient', recipientSchema);