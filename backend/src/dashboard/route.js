import express from "express";
import DashboardHandler from "./handler.js";

const router = express.Router();
const dashboardHandler = new DashboardHandler();

router.get('/', dashboardHandler.getMetrics)

export default router;