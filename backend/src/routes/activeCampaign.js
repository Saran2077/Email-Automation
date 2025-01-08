import express from 'express';
import { handleGetLists, handleSendMail } from '../../controllers/activeCampaign.js';

const router = express.Router();

router.post('/send_mail', handleSendMail)
router.get('/lists', handleGetLists)

export default router;