import express from 'express';
import { handleContactBulkUpload, handleGetLists, handleSendMail } from '../../controllers/activeCampaign.js';

const router = express.Router();

router.post('/send_mail', handleSendMail)
router.get('/lists', handleGetLists)
router.post('/contact/bulk-upload', handleContactBulkUpload)

export default router;