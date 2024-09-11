const express = require("express");
const { generateShortURL, getAnanlytics } = require("../controllers/url");

const router = express.Router();

router.post("/", generateShortURL);
router.get("/analytics/:shortID", getAnanlytics);

module.exports = router;
