import { User } from '../models/User.js';

class AuthRepository {
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  async updateUser(query, updateData) {
    try {
      return await User.findOneAndUpdate(
        query,
        updateData,
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async findUserById(query, selectFields) {
    try {
      return await User.findOne(query, selectFields);
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }
}

export default new AuthRepository(); 