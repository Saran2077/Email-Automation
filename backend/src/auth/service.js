import AuthRepository from '../../utils/repository/Auth.js';
import jwt from '../../middleware/jwt.js';

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
      const token = jwt.sign({ userId: user._id, email: user.email });
      
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

      // Update last login
      await AuthRepository.updateUser(user._id, { lastLogin: new Date() });

      // Generate token
      const token = jwt.sign({ userId: user._id, email: user.email });

      return { user, token };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;

