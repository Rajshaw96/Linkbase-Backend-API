const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { uploadBranding } = require("../controllers/brandingController");

router.post(
  "/branding",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  uploadBranding
);

module.exports = router;
