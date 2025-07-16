const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  propertyLocationId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GuestDetails", GuestSchema);
