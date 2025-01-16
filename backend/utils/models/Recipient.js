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

export const Recipient = mongoose.model('Recipient', recipientSchema);