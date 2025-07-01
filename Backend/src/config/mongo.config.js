import mongoose from "mongoose";    

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
           
        });
        console.log('MongoDB connected successfully',process.env.MONGO_URI);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectMongoDB;