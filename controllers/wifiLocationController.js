const axios = require("axios");
const getHaloWiFiToken = require('../utils/haloWiFiToken');
const Location = require("../models/Location");

// POST /api/createLocation
const createLocation = async (req, res) => {
  const token = await getHaloWiFiToken();
  if (!token) {
    return res.status(401).json({ message: "Failed to get token", status: "error" });
  }

  const {
    name,
    address,
    category,
    state,
    postal,
    country,
    contact_email,
    contact_phone_no,
    short_description,
    description
  } = req.body;

  if (!name || !address || !category || !short_description || !description) {
    return res.status(400).json({ message: "All fields are required", status: "error" });
  }

  try {
    const response = await axios.post(
      `${process.env.EXTERNAL_API_URL}/external/locations/add`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const locationData = response.data?.location;
    if (locationData?.location_id) {
      const location = new Location({
        ...locationData,
        createdAt: new Date().toISOString()
      });
      await location.save();

      return res.status(200).json({
        message: "Location created and saved successfully.",
        status: "success",
        location
      });
    } else {
      return res.status(500).json({
        message: "API response invalid - missing location_id.",
        status: "error"
      });
    }
  } catch (err) {
    console.error("Create error:", err);
    return res.status(500).json({
      message: "Failed to create location",
      status: "error",
      error: err.message
    });
  }
};

// GET /api/getAllLocations
const getAllLocations = async (req, res) => {
  const { location_id, short_description } = req.query;

  const token = await getHaloWiFiToken();
  if (!token) {
    return res.status(401).json({ message: "Failed to get token", status: "error" });
  }

  try {
    const response = await axios.get(`${process.env.EXTERNAL_API_URL}/external/locations`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const locations = response.data?.locations || [];
    const filtered = locations.filter((loc) => {
      return (
        (!location_id || loc.location_id === location_id) &&
        (!short_description || loc.short_description === short_description)
      );
    });

    if (location_id || short_description) {
      return res.status(filtered.length ? 200 : 404).json({
        message: filtered.length
          ? "Filtered location(s) fetched successfully."
          : "No locations matched the given criteria.",
        status: filtered.length ? "success" : "error",
        locations: filtered.length === 1 ? filtered[0] : filtered
      });
    }

    return res.status(200).json({
      message: "Locations fetched successfully",
      status: "success",
      locations
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "error"
    });
  }
};

module.exports = { createLocation, getAllLocations };
