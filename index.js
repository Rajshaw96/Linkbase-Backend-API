require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/database');
const logger = require('./utils/logger');

// Import Routes
const wifiRoutes = require('./routes/wifiRoutes');
const brandingRoutes = require("./routes/brandingRoutes");
const wifiNetworkRoutes = require("./routes/wifiNetworkRoutes");
const wifiLocationRoutes = require("./routes/wifiLocationRoutes");
const networkingDevicesRoutes = require("./routes/networkingDevicesRoutes");
const guestConnectRoutes = require("./routes/guestConnectRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();

// Connect to MongoDB
connectDB()
  .then(() => logger.info('✅ MongoDB connected successfully'))
  .catch((err) => logger.error(`❌ MongoDB connection error: ${err.message}`));

// Use Helmet for security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
}));

// Enable JSON parsing
app.use(express.json());

// Set allowed CORS origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5502',
      'https://linkbase.tech',
    ];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`🛑 CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Health check route
app.get("/", (req, res) => {
  logger.info('Root route accessed');
  res.send("🚀 Hello from Linkbase API!");
});

// Register API Routes
app.use('/connect/external', wifiRoutes);
app.use("/api", brandingRoutes);
app.use("/api", wifiNetworkRoutes);
app.use("/api", wifiLocationRoutes);
app.use("/api", guestConnectRoutes);
app.use("/api", networkingDevicesRoutes);
app.use("/api/forms", formRoutes);

// Start the server
const PORT = process.env.PORT || 5900;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
});
