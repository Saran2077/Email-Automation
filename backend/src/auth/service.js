import AuthRepository from '../../utils/repository/Auth.js';
import JsonWebToken from '../../middleware/jwt.js';

const jwt = new JsonWebToken();

class AuthService {
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await AuthRepository.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user
      const user = await AuthRepository.createUser(userData);
      
      // Generate token
      const token = jwt.sign({ 
        userId: user.userId,  // Using userId instead of _id
        email: user.email 
      });
      
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await AuthRepository.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Update last login using userId
      await AuthRepository.updateUser({ userId: user.userId }, { lastLogin: new Date() });

      // Generate token
      const token = jwt.sign({ 
        userId: user.userId,  // Using userId instead of _id
        email: user.email 
      });

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async update(query, userData) {
    try {
      const user = await AuthRepository.updateUser(query, userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(query, userData) {
    try {
      const user = await AuthRepository.updateUser(query, userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getProfileInfo(query) {
    try {
      const selectFields = {
        userId: 1,
        email: 1,
        username: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1
      };
      const user = await AuthRepository.findUserById(query, selectFields);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getSettingsInfo(query) {
    try {
      const selectFields = {
        userId: 1,
        email: 1,
        apiKeys: 1,
        apiUrls: 1,
        organization: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1
      };
      const user = await AuthRepository.findUserById(query, selectFields);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;




