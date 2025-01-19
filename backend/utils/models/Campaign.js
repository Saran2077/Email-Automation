import mongoose from 'mongoose';
import { Counter } from './Counter.js';

const campaignSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Idle', 'Running', 'Ready', 'Sending'],
    default: 'Idle'
  },
  recipientsList: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Recipient', 
  },
  generatedEmails: {
    type: [
      {
        name: String,
        email: String,
        subject: String,
        body: String,
        createdAt: { type: Date, default: Date.now },
      }
    ]
  },
  promptTemplate: {
    type: {
      senderCompanyContext: new mongoose.Schema(
        {
          companyName: { type: String, required: false },
          companyDescription: { type: String, required: false },
          companyWebsite: { type: String, required: false },
          productAndServices: { type: String, required: false },
        },
        { strict: false, _id: false }
      ),
  
      targetCompanyContext: new mongoose.Schema(
        {
          companyName: { type: String, required: false },
          companyDescription: { type: String, required: false },
          industry: { type: String, required: false },
          companyDomain: { type: String, required: false }
        },
        { strict: false, _id: false }
      ),
  
      recipientContext: new mongoose.Schema(
        {
          name: { type: String, required: false },
          designation: { type: String, required: false },
          shortBio: { type: String, required: false },
        },
        { strict: false, _id: false }
      ),
  
      senderContext: new mongoose.Schema(
        {
          name: { type: String, required: false },
          designation: { type: String, required: false },
          companyName: { type: String, required: false },
        },
        { strict: false, _id: false }
      ),
  
      customPrompt: [
        new mongoose.Schema(
          {
            name: { type: String, required: true },
            content: { type: String, required: true },
          },
          { strict: true, _id: false }
        ),
      ],
  
      customInstructions: { type: String, required: false },
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  createdById: {
    type: Number,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to auto-increment campaignId
campaignSchema.pre('save', async function(next) {
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