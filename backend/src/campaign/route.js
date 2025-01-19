import express from "express";
import CampaignHandler from "./handler.js";
import { authenticate } from "../../middleware/auth.js";        

const router = express.Router();
const campaignHandler = new CampaignHandler();

router.post('/', campaignHandler.list)
router.post('/create', campaignHandler.create)
router.post('/get/:id', campaignHandler.getById)
router.post('/add/:id', campaignHandler.addRecipient)
router.post('/update/:id', campaignHandler.update)
router.delete('/:id', campaignHandler.delete)

export default router;