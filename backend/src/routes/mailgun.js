import express from "express";
import { email_clicked, email_opened } from "../../controllers/mailgun.js";

const router = express.Router();

router.post('/email_opened', email_opened);
router.post('/email_clicked', email_clicked);
// router.post('/email_replied')

export default router;