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

// Add this to tell Mongoose to use userId for population
userSchema.set('toObject', { getters: true });
userSchema.set('toJSON', { getters: true });

// Pre-save middleware to auto-increment userId
userSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.userId) {
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

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!this.password || !candidatePassword) {
      return false;
    }
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison details:', {
      candidatePassword: !!candidatePassword,
      hashedPassword: !!this.password,
      isMatch: isMatch
    });
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Add post-save middleware to ensure userId exists
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('userId must be unique'));
  } else {
    next(error);
  }
});

export const User = mongoose.model('User', userSchema); 