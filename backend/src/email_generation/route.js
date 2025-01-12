import express from 'express';
import EmailGenerationHandler from './handler.js';

const router = express.Router();

const handler = new EmailGenerationHandler();

router.post('/generate_email', handler.generateEmail);
router.post('/generate_email_with_ai', handler.generateEmailWithAI);
router.post('/prompt_template_creation', handler.promptTemplateCreation);
router.get('/get_prompt_template/:email', handler.getPromptTemplate);

export default router;