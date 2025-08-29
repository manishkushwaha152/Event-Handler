const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Associated event is required"],
    },
    type: {
      type: String,
      required: [true, "Ticket type is required"],
      trim: true,
      enum: ["VIP", "General", "Student", "Early Bird", "Custom"],
    },
    price: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Price must be a positive value"],
    },
    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
