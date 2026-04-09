const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Login with Google Firebase
router.post("/login", async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        error: "uid and email are required"
      });
    }

    const user = await User.findOneAndUpdate(
      { $or: [{ uid }, { email }] },
      {
        $set: {
          uid,
          name,
          email,
          photoURL
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    console.log("✅ User login synced:", email);

    res.json({ success: true, user });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
