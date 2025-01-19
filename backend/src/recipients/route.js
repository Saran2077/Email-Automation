import express from 'express';
import RecipientHandler from './handler.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();
const recipientHandler = new RecipientHandler();

router.post('/create', authenticate, recipientHandler.createRecipient);
router.post('/bulk-create', authenticate, recipientHandler.bulkCreateRecipients);
router.get('/get/:id', authenticate, recipientHandler.getRecipient);
router.get('/get-by-email/:email', authenticate, recipientHandler.getRecipientByEmail);
router.post('/update/:id', authenticate, recipientHandler.updateRecipient);
router.post('/update_stage/:id', authenticate, recipientHandler.updateRecipientStage);
router.delete('/delete/:id', authenticate, recipientHandler.deleteRecipient);
router.get('/list', authenticate, recipientHandler.listRecipients);
router.get('/metrics/:emailId', authenticate, recipientHandler.getRecipientMetrics);
router.get('/emails/:id', authenticate, recipientHandler.getEmailsByRecipient);

export default router;