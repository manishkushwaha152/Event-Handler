const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "owner" },
}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);
