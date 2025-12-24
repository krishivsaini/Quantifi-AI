const mongoose = require("mongoose")


const connectDB = async (retries = 5, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                ssl: true,
                tlsAllowInvalidCertificates: true,
            });
            console.log("MongoDB connected");
            return;
        } catch (error) {
            console.error(`MongoDB connection failed (attempt ${i + 1}):`, error.message);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                process.exit(1);
            }
        }
    }
}

module.exports = connectDB;