// Script to check all users in MongoDB
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all users
    const users = await User.find({});
    
    console.log("\n📊 Total Users in Database:", users.length);
    console.log("─".repeat(80));
    
    if (users.length === 0) {
      console.log("❌ No users found in database yet.");
      console.log("\nTo save users:");
      console.log("1. Open http://localhost:5000 in browser");
      console.log("2. Click 'Shop Now'");
      console.log("3. Click 'Continue with Google'");
      console.log("4. Sign in with your Google account");
      console.log("5. Run this script again to see the saved user");
    } else {
      users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   Name:       ${user.name}`);
        console.log(`   Email:      ${user.email}`);
        console.log(`   Firebase UID: ${user.uid}`);
        console.log(`   Photo:      ${user.photoURL || 'N/A'}`);
        console.log(`   Created:    ${user.createdAt}`);
        console.log("─".repeat(80));
      });
    }

    // Disconnect
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkUsers();
