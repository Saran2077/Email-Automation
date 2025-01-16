import express from "express";
import CampaignHandler from "./handler.js";

const router = express.Router();
const campaignHandler = new CampaignHandler();

router.post('/create', campaignHandler.create)
router.post('/get/:id', campaignHandler.getById)
router.post('/update/:id', campaignHandler.update)
router.delete('/:id', campaignHandler.delete)
router.get('/', campaignHandler.list)

export default router;