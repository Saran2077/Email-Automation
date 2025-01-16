import mongoose from 'mongoose';
import { Counter } from './Counter.js';

const emailSchema = new mongoose.Schema({
  emailId: {
    type: Number,
    unique: true
  },
  subject: {
    type: String,
    // required: true,
    trim: true
  },
  messageId: {
    type: String,
    unique: true
  },
  body: {
    type: String,
    // required: true
  },
  from: {
    type: String,
    ref: 'Recipient',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true
  },
  status: {
    type: [String],
    enum: ['delivered', 'accepted', 'complaints', 'unsubscribes', 'opened', 'clicked', 'hard-bounced', 'soft-bounced', 'unopened'],
    default: []
  },  
  isStarred: {
    type: Boolean,
    default: false
  },
  isReceived: {
    type: Boolean,
    default: false
  },
  isSent: {
    type: Boolean,
    default: false
  },
  isFailed: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to auto-increment emailId
emailSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'emailId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.emailId = counter.seq;
  }
  next();
});

emailSchema.statics.getEmailsByRecipient = async function(recipientId) {
    try {
        const emails = await this.find({
            $or: [
                { to: recipientId },
                { from: recipientId }
            ]
        })
        .sort({ createdAt: -1 })
        .select('subject body status createdAt messageId isStarred isDraft isSent isReceived');

        return emails;
    } catch (error) {
        console.error('Error fetching emails by recipient:', error);
        throw error;
    }
};

export const Email = mongoose.model('Email', emailSchema);
