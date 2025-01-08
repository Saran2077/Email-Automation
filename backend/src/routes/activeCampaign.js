import express from 'express';
import { handleSendMail } from '../../controllers/activeCampaign.js';

const router = express.Router();

router.post('/send_mail', handleSendMail)

export default router;