const express = require("express");
const { tryOn } = require("../utils/tryOn");

const router = express.Router();

/**
 * POST /api/tryon or /tryon
 * Body:
 * {
 *   "personImage": "https://...",
 *   "garmentImage": "https://...",
 *   "garmentDescription": "Short description of garment",
 *   "category": "upper_body"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const {
      personImage,
      garmentImage,
      garmentDescription,
      category = "upper_body",
    } = req.body;

    console.log("🧵 Try-on request received");

    if (!personImage || !garmentImage) {
      return res.status(400).json({
        success: false,
        error: "personImage and garmentImage are required",
      });
    }

    if (category !== "upper_body") {
      return res.status(400).json({
        success: false,
        error: "category must be upper_body",
      });
    }

    const outputImage = await tryOn({
      personImage,
      garmentImage,
      garmentDescription,
      category,
    });

    console.log("✅ Try-on generated successfully");

    return res.status(200).json({
      success: true,
      outputImage,
    });

  } catch (error) {
    console.error("❌ Try-on error:", error.message);

    const isInputOrConfigIssue =
      error.message.includes("valid public image URL") ||
      error.message.includes("data URI") ||
      error.message.includes("REPLICATE_API_TOKEN") ||
      error.message.includes("upper_body");

    return res.status(isInputOrConfigIssue ? 400 : 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;