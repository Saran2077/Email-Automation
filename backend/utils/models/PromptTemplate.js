import mongoose from 'mongoose';
import { Counter } from './Counter.js';

const promptTemplateSchema = new mongoose.Schema({
  promptTemplateId: {
    type: Number,
    unique: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    required: true
  },
  senderCompanyContext: {
    companyName: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    productAndServices: {
      type: String,
    }
  },
  targetCompanyContext: {
    companyName: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    industry: {
      type: String,
    }
  },
  recipientContext: {
    name: {
      type: String,
    },
    designation: {
      type: String,
    },
    shortBio: {
      type: String,
    }
  },
  senderContext: {
    name: {
      type: String,
    },
    designation: {
      type: String,
    },
    companyName: {
      type: String,
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to auto-increment emailId
promptTemplateSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'promptTemplateId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.promptTemplateId = counter.seq;
  }
  next();
});

export const PromptTemplate = mongoose.model('PromptTemplate', promptTemplateSchema);
