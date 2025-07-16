const express = require("express");
const router = express.Router();
const { createLocation, getAllLocations } = require("../controllers/wifiLocationController");

router.post("/createLocation", createLocation);
router.get("/getAllLocations", getAllLocations);

module.exports = router;
