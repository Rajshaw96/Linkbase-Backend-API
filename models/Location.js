const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  location_id: { type: String, required: true, unique: true },
  name: String,
  address: String,
  category: String,
  state: String,
  postal: String,
  country: String,
  contact_email: String,
  contact_phone_no: String,
  short_description: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Location", LocationSchema);
