import mongoose from 'mongoose';

export async function connectToMongoDB(uri) {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB with Mongoose");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
