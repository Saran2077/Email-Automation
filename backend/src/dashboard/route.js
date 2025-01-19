import express from "express";
import DashboardHandler from "./handler.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();
const dashboardHandler = new DashboardHandler();

router.get('/', authenticate, dashboardHandler.getMetrics)

export default router;