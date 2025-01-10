import express from 'express';
import { handleContactBulkUpload, handleGetLists, handleSendMail, handleUpdateStage } from '../../controllers/activeCampaign.js';

const router = express.Router();

router.post('/send_mail', handleSendMail)
router.post('/update_stage', handleUpdateStage)
router.get('/lists', handleGetLists)
router.post('/contact/bulk-upload', handleContactBulkUpload)

export default router;