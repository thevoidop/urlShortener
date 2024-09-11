const shortid = require("shortid");
const URL = require("../models/url");

async function generateShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });
    const shortID = shortid();
    await URL.create({
        shortID: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    return res.render("index", { id: shortID });
}

async function getAnanlytics(req, res) {
    const shortID = req.params.shortID;
    const result = await URL.findOne({ shortID });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = { generateShortURL, getAnanlytics };
