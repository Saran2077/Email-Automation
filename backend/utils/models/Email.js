import mongoose from 'mongoose';
import { Counter } from './Counter.js';

const emailSchema = new mongoose.Schema({
  emailId: {
    type: Number,
    unique: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'delivered', 'opened', 'clicked', 'bounced'],
    default: 'draft'
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: false
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

export const Email = mongoose.model('Email', emailSchema);
