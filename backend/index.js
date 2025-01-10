import express from 'express';
import cors from 'cors';
import activeCampaignRoutes from "./src/routes/activeCampaign.js";
import mailgunRoutes from "./src/routes/mailgun.js";
import scrapRoutes from "./src/routes/scrap.js";
import dotenv from 'dotenv';
import { connectToMongoDB } from './db/dbConnect.js';
import recipientRoutes from "./src/recipients/route.js";
import mailboxRoutes from "./src/mailbox/route.js";
import dashboardRoutes from "./src/dashboard/route.js";
import authRoutes from "./src/auth/route.js";
import emailGenerationRoutes from "./src/email_generation/route.js";

dotenv.config();

connectToMongoDB();

const app = express();
const port = process.env.PORT || 3000;

export let emailData = []

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

app.use('/api/activeCampaign', activeCampaignRoutes)
app.use('/api/mailgun', mailgunRoutes)
app.use('/api/scrap', scrapRoutes)
app.use('/api/v1/recipients', recipientRoutes)
app.use('/api/v1/mailbox', mailboxRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/email_generation', emailGenerationRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});