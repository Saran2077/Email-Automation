import express from 'express';
import EmailGenerationHandler from './handler.js';

const router = express.Router();

const handler = new EmailGenerationHandler();

router.post('/generate_email', handler.generateEmail);
router.post('/generate_email_with_ai', handler.generateEmailWithAI);

export default router;