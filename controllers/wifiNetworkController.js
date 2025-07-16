const axios = require("axios");
const { getHaloWiFiToken } = require("../utils/haloWiFiToken"); // adjust the path if needed

// POST /api/networking
const createNetworking = async (req, res) => {
  const token = await getHaloWiFiToken();
  if (!token) {
    return res.status(401).json({ message: "Failed to get token", status: "error" });
  }

  const {
    location_id,
    networking_id,
    essid_2_4ghz,
    essid_5_8ghz,
    essid_6ghz,
    radio_2_4ghz,
    radio_5_8ghz,
    radio_6ghz,
    access,
    psk_password,
    guest_login
  } = req.body;

  if (!location_id) {
    return res.status(400).json({ message: "'location_id' is required.", status: "error" });
  }

  if (!access || !["open", "psk2"].includes(access)) {
    return res.status(400).json({ message: "Invalid 'access' value.", status: "error" });
  }

  if (access === "psk2" && (!psk_password || psk_password.length < 8)) {
    return res.status(400).json({ message: "'psk_password' required and must be >= 8 characters.", status: "error" });
  }

  if (access === "open" && (!guest_login || guest_login.trim() === "")) {
    return res.status(400).json({ message: "'guest_login' required for open access.", status: "error" });
  }

  const payload = {
    ...(networking_id && { networking_id }),
    ...(essid_2_4ghz && { essid_2_4ghz }),
    ...(essid_5_8ghz && { essid_5_8ghz }),
    ...(essid_6ghz && { essid_6ghz }),
    ...(typeof radio_2_4ghz === "boolean" && { radio_2_4ghz }),
    ...(typeof radio_5_8ghz === "boolean" && { radio_5_8ghz }),
    ...(typeof radio_6ghz === "boolean" && { radio_6ghz }),
    access,
    ...(access === "psk2" && { psk_password }),
    ...(access === "open" && { guest_login })
  };

  try {
    const response = await axios.post(
      `${process.env.EXTERNAL_API_URL}/external/location/${location_id}/networking`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message,
      status: "error"
    });
  }
};

// POST /api/update-networking
const updateNetworking = async (req, res) => {
  const token = await getHaloWiFiToken();
  if (!token) {
    return res.status(401).json({ message: "Failed to get token", status: "error" });
  }

  const { id, networking_uuid, essid } = req.body;

  if (!id || !networking_uuid) {
    return res.status(400).json({ message: "'id' and 'networking_uuid' are required.", status: "error" });
  }

  try {
    const url = `${process.env.EXTERNAL_API_URL}/external/location/${id}/networking/${networking_uuid}/update`;
    const response = await axios.post(
      url,
      { essid },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message,
      status: "error"
    });
  }
};

module.exports = { createNetworking, updateNetworking };
