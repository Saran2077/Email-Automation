import mongoose from 'mongoose';
import { Counter } from '../utils/models/Counter.js';

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  customerCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient'
  }]
}, {
  timestamps: true
});

// Pre-save middleware to auto-increment campaignId
campaignSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'campaignId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.campaignId = counter.seq;
  }
  next();
});

export const Campaign = mongoose.model('Campaign', campaignSchema); 
