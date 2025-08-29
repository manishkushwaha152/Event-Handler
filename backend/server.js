require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const transporter = require("./config/email");  // Adjust path if needed
import authRoutes from "../routes/auth.js";
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware for parsing requests
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Auth routes
app.use("/api/auth/owner", require("./routes/auth/ownerAuthRoutes"));
app.use("/api/auth/user", require("./routes/auth/userAuthRoutes"));

// Functional routes
app.use("/api/event", require("./routes/eventRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/owner", require("./routes/ownerRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

app.use("/auth", authRoutes);

// Stripe webhook (if enabled)
// app.use("/webhook", require("./webhooks/stripeWebhook"));

// Health check
app.get("/", (req, res) => {
  res.send("Event Handler API is running...");
});

// Error middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);


transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Failed ", error);
  } else {
    console.log("SMTP Server is Ready ");
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
