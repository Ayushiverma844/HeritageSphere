const db = require("../config/db");

// ==========================================
// Get Logged In User Profile
// ==========================================
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user] = await db.query(
      `
      SELECT
        user_id,
        name,
        email,
        role,
        mobile_number,
        date_of_birth,
        city,
        state,
        country,
        profile_image,
        created_at
      FROM users
      WHERE user_id = ?
      `,
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================
    // Collection Stats
    // ======================

    const [stats] = await db.query(
      `
      SELECT

      COUNT(*) AS totalCollection,

      SUM(item_type='PLACE') AS savedPlaces,

      SUM(item_type='STORY') AS savedStories

      FROM saved_items

      WHERE user_id = ?
      `,
      [userId]
    );

    res.status(200).json({
      success: true,

      user: user[0],

      stats: {
        totalCollection:
          Number(stats[0].totalCollection) || 0,

        savedPlaces:
          Number(stats[0].savedPlaces) || 0,

        savedStories:
          Number(stats[0].savedStories) || 0,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Update Profile
// ==========================================
const updateProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    let {
      name,
      mobile_number,
      date_of_birth,
      city,
      state,
      country
    } = req.body;

    name = name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    // Check user exists
    const [existing] = await db.query(
      `
      SELECT user_id
      FROM users
      WHERE user_id = ?
      `,
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        mobile_number = ?,
        date_of_birth = ?,
        city = ?,
        state = ?,
        country = ?
      WHERE user_id = ?
      `,
      [
        name,
        mobile_number || null,
        date_of_birth || null,
        city || null,
        state || null,
        country || null,
        userId
      ]
    );

    // Return updated user
    const [updatedUser] = await db.query(
      `
      SELECT
        user_id,
        name,
        email,
        role,
        mobile_number,
        date_of_birth,
        city,
        state,
        country,
        profile_image,
        created_at
      FROM users
      WHERE user_id = ?
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  getProfile,
  updateProfile
};