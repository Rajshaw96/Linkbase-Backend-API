const express = require("express");
const router = express.Router();
const { addNetworkingDevice,updateNetworkingDevice } = require("../controllers/networkingDevicesController");

router.post("/networking-devices", addNetworkingDevice);
router.post("/update-networking-devices", updateNetworkingDevice);

module.exports = router;
