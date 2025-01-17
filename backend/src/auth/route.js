import express from "express";
import AuthHandler from "./handler.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();
const handler = new AuthHandler();

router.post('/login', handler.login);
router.post('/register', handler.register);

router.post('/update', authenticate, handler.update);
router.post('/update-password', authenticate, handler.updatePassword);
router.get('/get-profile-info', authenticate, handler.getProfileInfo);
router.get('/get-settings-info', authenticate, handler.getSettingsInfo);

export default router;