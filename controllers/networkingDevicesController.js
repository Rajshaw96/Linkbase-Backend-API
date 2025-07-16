const axios = require("axios");
const { getHaloWiFiToken } = require("../utils/haloWiFiToken");

// POST /api/networking-devices
const addNetworkingDevice = async (req, res) => {
  const token = await getHaloWiFiToken();
  if (!token) {
    return res.status(401).json({ message: "Failed to get token", status: "error" });
  }

  const { location_id, serial_no } = req.body;
  if (!location_id || !serial_no) {
    return res.status(400).json({ message: "'location_id' and 'serial_no' are required.", status: "error" });
  }

  try {
    const url = `${process.env.EXTERNAL_API_URL}/external/location/${location_id}/networking-devices/add`;
    const response = await axios.post(
      url,
      { serial_no },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.status(response.status).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message,
      status: "error"
    });
  }
};

// POST /api/update-networking-devices
const updateNetworkingDevice = async (req, res) => {
  const token = await getHaloWiFiToken();
  if (!token) {
    return res.status(401).json({ message: "Failed to get token", status: "error" });
  }

  const { id, uuid, name } = req.body;
  if (!id || !uuid) {
    return res.status(400).json({ message: "'id' and 'uuid' are required.", status: "error" });
  }

  try {
    const url = `${process.env.EXTERNAL_API_URL}/external/location/${id}/networking-device/${uuid}`;
    const response = await axios.put(
      url,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.status(response.status).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message,
      status: "error"
    });
  }
};

module.exports = { addNetworkingDevice, updateNetworkingDevice };
