import express from 'express';
import EmailGenerationHandler from './handler';

const router = express.Router();

const handler = new EmailGenerationHandler();

router.post('/generate_email', handler.generateEmail);

export default router;