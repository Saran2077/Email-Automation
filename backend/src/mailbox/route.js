import express from 'express';
import MailboxHandler from './handler.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();
const handler = new MailboxHandler()

router.post('/create_draft_email', authenticate, handler.draftEmail)
router.post('/update_draft_email', authenticate, handler.updateDraftEmail)
router.get('/list_draft_email', authenticate, handler.listDraftEmail)
router.post('/send_email', authenticate, handler.sendEmail)
router.get('/list_sent_email', authenticate, handler.listSentEmail)
router.get('/list_inbox_email', authenticate, handler.inboxEmail)
router.get('/list_starred_email', authenticate, handler.listStarEmail)
router.post('/star_email/:id', authenticate, handler.starEmail)
router.get('/:id', authenticate, handler.getEmailById)

export default router;