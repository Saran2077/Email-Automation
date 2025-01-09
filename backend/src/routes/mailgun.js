import express from "express";
import { email_clicked, email_opened, email_replied } from "../../controllers/mailgun.js";

const router = express.Router();

router.post('/email_opened', email_opened);
router.post('/email_clicked', email_clicked);
router.post('/email_replied', email_replied);
// router.post('/email_replied')

export default router;