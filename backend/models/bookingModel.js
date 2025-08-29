const mongoose = require("mongoose");

// ✅ Seat Sub-Schema
const seatSchema = new mongoose.Schema({
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  row: { type: String, required: true },
  number: { type: Number, required: true },
  category: { type: String, required: true },
  label: { type: String, required: true }, // ✅ This avoids "label is required" error
});

// ✅ Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    seats: {
      type: [seatSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one seat must be booked",
      },
    },
    qrCode: { type: String },
    status: {
      type: String,
      enum: ["confirmed", "canceled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
