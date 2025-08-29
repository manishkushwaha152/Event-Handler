const mongoose = require("mongoose");

// 🔹 Seat Schema (used for event.seats)
const seatSchema = new mongoose.Schema(
  {
    row: { type: String, required: true },
    number: { type: Number, required: true },
    label: { type: String, required: true }, // e.g., "A1", "B7"
    category: {
      type: String,
      enum: ["VIP", "General"],
      required: true,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
  },
  { _id: true } // each seat has its own ObjectId
);

// 🔹 Event Schema
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    price: { type: Number, default: 0 }, // optional event-level price
    city: { type: String, trim: true },
    area: { type: String, trim: true },
    category: { type: String }, // optional category
    seats: [seatSchema], // ✅ Embedded seat info per event
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
