import express from 'express';
import MailboxHandler from './handler.js';

const router = express.Router();
const handler = new MailboxHandler()

router.post('/create_draft_email', handler.draftEmail)
router.get('/list_draft_email', handler.listDraftEmail)

export default router;