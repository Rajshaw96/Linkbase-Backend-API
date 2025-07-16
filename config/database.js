// Load environment variables from .env file into process.env
require('dotenv').config();

// Import the Mongoose library for MongoDB interaction
const mongoose = require("mongoose");

// Read the MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Define an async function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect using Mongoose
    await mongoose.connect(mongoURI);

    // Log success message if connection is successful
    console.log("MongoDB connected successfully!");
  } catch (err) {
    // Log error message if connection fails
    console.error("MongoDB connection error:", err.message);

    // Exit the process with a failure code
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other files
module.exports = connectDB;
