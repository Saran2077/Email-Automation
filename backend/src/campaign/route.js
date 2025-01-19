import express from "express";
import CampaignHandler from "./handler.js";
import { authenticate } from "../../middleware/auth.js";        

const router = express.Router();
const campaignHandler = new CampaignHandler();

router.post('/', campaignHandler.list)
router.post('/create', campaignHandler.create)
router.get('/get/:id', campaignHandler.getById)
router.post('/add/:id', campaignHandler.addRecipient)
router.post('/remove/:id', campaignHandler.removeRecipient)
router.post('/generate_emails/:id', campaignHandler.generateEmails)
router.post('/send_emails/:id', authenticate , campaignHandler.sendEmails)
router.post('/regenerate/:id', authenticate , campaignHandler.regenerate)
router.post('/update/:id', campaignHandler.update)
router.delete('/delete/:id', campaignHandler.delete)

export default router;