import express from 'express';
import RecipientHandler from './handler.js';

const router = express.Router();
const recipientHandler = new RecipientHandler();

router.post('/create', recipientHandler.createRecipient);
router.post('/bulk-create', recipientHandler.bulkCreateRecipients);
router.get('/get/:id', recipientHandler.getRecipient);
router.get('/get-by-email/:email', recipientHandler.getRecipientByEmail);
router.post('/update/:id', recipientHandler.updateRecipient);
router.post('/update_stage/:id', recipientHandler.updateRecipientStage);
router.delete('/delete/:id', recipientHandler.deleteRecipient);
router.get('/list', recipientHandler.listRecipients);
router.get('/metrics/:emailId', recipientHandler.getRecipientMetrics);
router.get('/emails/:id', recipientHandler.getEmailsByRecipient);

export default router;