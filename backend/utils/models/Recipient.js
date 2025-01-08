import mongoose from 'mongoose';
import { Counter } from './Counter.js';

const recipientSchema = new mongoose.Schema({
  recipientId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'opened', 'clicked', 'bounced'],
    default: 'pending'
  },
  stage: {
    type: String,
    enum: ['contact', 'lead', 'deal', 'account'],
    default: 'contact'
  },
  // Campaign relationship (optional)
  campaigns: [{
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'opened', 'clicked', 'bounced'],
      default: 'pending'
    }
  }],
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

// Pre-save middleware to auto-increment campaignId
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

export const Recipient = mongoose.model('Recipient', recipientSchema);