const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  
  if (process.env.NODE_ENV === "production" && !primaryUri) {
    throw new Error("MONGO_URI environment variable is missing in production Vercel environment!");
  }

  const uri = primaryUri || "mongodb://127.0.0.1:27017/hacklytics";

  if (process.env.NODE_ENV === "production") {
    // Serverless production deployment
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Production MongoDB Connected successfully");
  } else {
    // Local development failover
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error(`⚠️ Primary connection failed: ${error.message}. Falling back to local DB...`);
      await mongoose.connect("mongodb://127.0.0.1:27017/hacklytics", { serverSelectionTimeoutMS: 3000 });
      console.log("✅ Local MongoDB Connected");
    }
  }
};

module.exports = connectDB;
