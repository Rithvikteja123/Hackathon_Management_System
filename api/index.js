const app = require("../server/app");
const connectDB = require("../server/config/db");

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("MongoDB serverless connection error:", err);
      return res.status(500).json({
        success: false,
        message: "Database connection failed. Check Vercel environment variables (MONGO_URI) and whitelist 0.0.0.0/0 on MongoDB Atlas.",
        error: err.message,
      });
    }
  }
  return app(req, res);
};
