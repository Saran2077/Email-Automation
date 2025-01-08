import express from 'express';
import MailboxHandler from './handler.js';

const router = express.Router();
const handler = new MailboxHandler()

router.post('/create_draft_email', handler.draftEmail)
router.post('/update_draft_email', handler.updateDraftEmail)
router.get('/list_draft_email', handler.listDraftEmail)
router.post('/send_email', handler.sendEmail)
router.get('/list_sent_email', handler.listSentEmail)

export default router;