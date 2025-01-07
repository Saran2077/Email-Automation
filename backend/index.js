import express from 'express';
import activeCampaignRoutes from "./routes/activeCampaign.js";
import mailgunRoutes from "./routes/mailgun.js";
import dotenv from 'dotenv';
import { connectToMongoDB } from './db/dbConnect.js';

dotenv.config();

connectToMongoDB();

const app = express();
const port = process.env.PORT || 3000;

export let emailData = []

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for retrieving a list of users
app.use('/api/activeCampaign', activeCampaignRoutes)
app.use('/api/mailgun', mailgunRoutes)


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});