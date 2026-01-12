import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(mongoUri);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        throw error;
    }
}