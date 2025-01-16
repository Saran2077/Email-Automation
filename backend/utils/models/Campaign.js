import mongoose from 'mongoose';
import { Counter } from './Counter.js';

const userSchema = new mongoose.Schema({
  campaignId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  recipientsList: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Recipient', 
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to auto-increment campaignId
userSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        'campaignId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.campaignId = counter.seq;
    }
    next();
  } catch (error) {
    next(error);
  }
});


export const Campaign = mongoose.model('Campaign', campaignSchema); 