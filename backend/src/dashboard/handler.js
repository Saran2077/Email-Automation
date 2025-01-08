import DashboardService from "./service.js";

const dashboardService = new DashboardService();



class DashboardHandler {
    
    async getMetrics(req, res, next) {
        try {
            const metrics = await dashboardService.getMetrics();
            res.status(201).json({ data: metrics });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default DashboardHandler;