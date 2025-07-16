const express = require("express");
const router = express.Router();
const { addGuest, getGuests } = require("../controllers/guestConnectController");

router.post("/guest-details", addGuest);
router.get("/guest-details", getGuests);

module.exports = router;
