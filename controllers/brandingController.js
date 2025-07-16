const axios = require("axios");
const FormData = require("form-data");
const { getHaloWiFiToken } = require("../utils/haloWiFiToken"); // adjust path if needed

// Max upload file size (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const uploadBranding = async (req, res) => {
  const token = await getHaloWiFiToken();
  if (!token) {
    return res.status(401).json({ message: 'Failed to get token', status: 'error' });
  }

  const { location_id } = req.body;
  if (!location_id) {
    return res.status(400).json({ message: 'location_id is required', status: 'error' });
  }

  try {
    const formData = new FormData();

    // Append files if they exist and are within size limit
    ['logo', 'background', 'banner'].forEach((field) => {
      const file = req.files?.[field]?.[0];
      if (file) {
        if (file.buffer.length > MAX_FILE_SIZE) {
          throw new Error(`${field} file exceeds maximum size of 2MB`);
        }
        formData.append(field, file.buffer, file.originalname);
      }
    });

    const apiUrl = `${process.env.EXTERNAL_API_URL}/external/location/${location_id}/branding`;

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      maxBodyLength: Infinity,
    });

    return res.status(response.status).json(response.data);
  } catch (err) {
    const statusCode = err.response?.status || 500;
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return res.status(statusCode).json({ message, status: 'error' });
  }
};

module.exports = { uploadBranding };
