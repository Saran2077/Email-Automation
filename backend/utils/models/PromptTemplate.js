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
  senderCompanyContext: new mongoose.Schema({
    companyName: { type: String },
    companyDescription: { type: String },
    companyWebsite: { type: String },
    productAndServices: { type: String }
  }, { strict: false, _id: false }),
  
  targetCompanyContext: new mongoose.Schema({
    companyName: { type: String },
    companyDescription: { type: String },
    industry: { type: String },
    companyDomain: { type: String }
  }, { strict: false, _id: false }),
  
  recipientContext: new mongoose.Schema({
    name: { type: String },
    designation: { type: String },
    shortBio: { type: String }
  }, { strict: false, _id: false }),
  
  senderContext: new mongoose.Schema({
    name: { type: String },
    designation: { type: String },
    companyName: { type: String }
  }, { strict: false, _id: false }),
  
  customPrompt: [{
    name: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  customInstructions: {
    type: String
  },
  createdById: {
    type: Number,
    ref: 'User',
    required: true
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
