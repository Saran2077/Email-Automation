import express from 'express';
import { handleAddContact, handleSendMail } from '../controllers/activeCampaign.js';

const router = express.Router();

router.post('/send_mail', handleSendMail)
router.post('/add_contact', handleAddContact)

export default router;