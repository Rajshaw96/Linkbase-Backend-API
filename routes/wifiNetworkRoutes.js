const express = require("express");
const router = express.Router();
const { createNetworking, updateNetworking } = require("../controllers/wifiNetworkController");

router.post("/networking", createNetworking);
router.post("/update-networking", updateNetworking);

module.exports = router;
