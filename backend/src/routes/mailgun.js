import express from "express";
import { email_accepted, email_clicked, email_complaints, email_delivered, email_hard_bounced, email_opened, email_replied, email_soft_bounced, email_unsubscribes } from "../../controllers/mailgun.js";

const router = express.Router();

router.post('/email_opened', email_opened);
router.post('/email_clicked', email_clicked);
router.post('/email_replied', email_replied);
router.post('/email_accepted', email_accepted);
router.post('/email_complaints', email_complaints);
router.post('/email_hard_bounced', email_hard_bounced);
router.post('/email_soft_bounced', email_soft_bounced);
router.post('/email_delivered', email_delivered);
router.post('/email_unsubscribes', email_unsubscribes);

export default router;