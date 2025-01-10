import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Counter } from './Counter.js';

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  apiKeys: {
    tracxn: String,
    mailgunMarketing: String,
    mailgunSales: String,
    activeCampaign: String
  },
  apiUrls: {
    mailgunMarketing: String,
    mailgunSales: String,
    activeCampaign: String
  },
  organization: {
    name: String,
    products: String,
    about: String,
    url: String,
    aboutPageUrl: String
  },
  lastLogin: Date,
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to auto-increment userId
userSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        'userId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.userId = counter.seq;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema); 