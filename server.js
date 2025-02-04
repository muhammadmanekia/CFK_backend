const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializeFirebase } = require("./config/firebase");
require("dotenv").config();

// Initialize Firebase first
initializeFirebase();

// Import routes
const eventRoutes = require("./routes/events");
const donationRoutes = require("./routes/donations");
const pledgeRoutes = require("./routes/pledges");
const authRoute = require("./routes/auth");
const rsvpRoutes = require("./routes/rsvps");
const dateAdjustRoutes = require("./controllers/dateAdjustment");
const notificationRoutes = require("./routes/notifications");
const messagesRoutes = require("./routes/messages");
const membershipsRoutes = require("./routes/memberships");
const googleEventRoutes = require("./routes/googleEvents");
const uploadRoutes = require("./routes/upload");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/messages", messagesRoutes);
app.use("/api/firebase", notificationRoutes);
app.use("/api/auth", authRoute);
app.use("/api/events", eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/pledges", pledgeRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/date-adjust", dateAdjustRoutes);
app.use("/api/membership", membershipsRoutes);
app.use("/api/google", googleEventRoutes);
app.use("/api/upload", uploadRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB: CFK_Data"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
