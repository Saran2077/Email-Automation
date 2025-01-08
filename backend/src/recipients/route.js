import express from 'express';
import RecipientHandler from './handler.js';

const router = express.Router();
const recipientHandler = new RecipientHandler();

router.post('/create', recipientHandler.createRecipient);
router.get('/get/:id', recipientHandler.getRecipient);
router.post('/update/:id', recipientHandler.updateRecipient);
router.delete('/delete/:id', recipientHandler.deleteRecipient);
router.get('/list', recipientHandler.listRecipients);

export default router;