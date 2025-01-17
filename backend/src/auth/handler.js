import AuthService from './service.js';
import JsonWebToken from '../../middleware/jwt.js';

const authService = new AuthService();
const jwt = new JsonWebToken();

class AuthHandler {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { body, headers } = req;
      const decoded = jwt.verify(headers.authorization.split(' ')[1]);
      const filterQuery = { userId: decoded.userId };
      const result = await authService.update(filterQuery, body);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { body, headers } = req;
      const decoded = jwt.verify(headers.authorization.split(' ')[1]);
      const filterQuery = { userId: decoded.userId };
      const result = await authService.updatePassword(filterQuery, body);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
     
  }

  async getProfileInfo(req, res) {  
    try {
      const { headers } = req;
      const decoded = jwt.verify(headers.authorization.split(' ')[1]);
      const filterQuery = { userId: decoded.userId };
      const result = await authService.getProfileInfo(filterQuery);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSettingsInfo(req, res) {
    try {
      const { headers } = req;
      const decoded = jwt.verify(headers.authorization.split(' ')[1]);
      const filterQuery = { userId: decoded.userId };
      const result = await authService.getSettingsInfo(filterQuery);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

}

export default AuthHandler;
