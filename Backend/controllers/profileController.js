const db = require("../config/db");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
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
      country,
    } = req.body;

    name = name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // ==============================
    // Check User Exists
    // ==============================

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
        message: "User not found",
      });
    }

    // ==============================
    // Upload Image (Optional)
    // ==============================

    let profileImage = null;

    if (req.file) {

      const uploadResult = await new Promise(
        (resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "heritagesphere/profile-images",
              },
              (error, result) => {

                if (error) return reject(error);

                resolve(result);

              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);

        }
      );

      profileImage = uploadResult.secure_url;

    }

    // ==============================
    // Update Profile
    // ==============================

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        mobile_number = ?,
        date_of_birth = ?,
        city = ?,
        state = ?,
        country = ?,
        profile_image = COALESCE(?, profile_image)
      WHERE user_id = ?
      `,
      [
        name,
        mobile_number || null,
        date_of_birth || null,
        city || null,
        state || null,
        country || null,
        profileImage,
        userId,
      ]
    );

    // ==============================
    // Return Updated User
    // ==============================

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
      user: updatedUser[0],
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
// Change Password
// ==========================================

const changePassword = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      current_password,
      new_password,
      confirm_password,
    } = req.body;

    if (
      !current_password ||
      !new_password ||
      !confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Get current user password

    const [users] = await db.query(
      `
      SELECT password
      FROM users
      WHERE user_id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password

    const isMatch = await bcrypt.compare(
      current_password,
      users[0].password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Prevent same password

    const samePassword = await bcrypt.compare(
      new_password,
      users[0].password
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // Hash new password

    const hashedPassword = await bcrypt.hash(
      new_password,
      10
    );

    // Update password

    await db.query(
      `
      UPDATE users
      SET password = ?
      WHERE user_id = ?
      `,
      [
        hashedPassword,
        userId,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};