const db = require("../config/db");

// ==========================
// Save Place (Favorite / Wishlist)
// ==========================
const savePlace = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { place_id, type } = req.body;

    if (!place_id || !type) {
      return res.status(400).json({
        success: false,
        message: "place_id and type are required",
      });
    }

    const typeMap = {
      liked: "FAVORITE",
      pending: "WISHLIST",
    };

    const save_type = typeMap[type];

    if (!save_type) {
      return res.status(400).json({
        success: false,
        message: "Invalid type (use liked or pending)",
      });
    }

    // Check if place exists (important)
    const [place] = await db.query(
      `SELECT place_id FROM places WHERE place_id = ?`,
      [place_id]
    );

    if (place.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // Check duplicate
    const [existing] = await db.query(
      `SELECT save_id FROM saved_places 
       WHERE user_id = ? AND place_id = ? AND save_type = ?`,
      [user_id, place_id, save_type]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Already saved",
      });
    }

    await db.query(
      `INSERT INTO saved_places (user_id, place_id, save_type)
       VALUES (?, ?, ?)`,
      [user_id, place_id, save_type]
    );

    res.status(201).json({
      success: true,
      message: "Place saved successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSavedPlaces = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [savedPlaces] = await db.query(
      `
      SELECT
        sp.save_id,
        sp.save_type,
        sp.created_at,

        p.place_id,
        p.name,
        p.city,
        p.state,
        p.country,
        p.short_description,
        p.best_time_to_visit

      FROM saved_places sp
      JOIN places p ON sp.place_id = p.place_id
      WHERE sp.user_id = ?
      ORDER BY sp.created_at DESC
      `,
      [user_id]
    );

    const data = savedPlaces.map((place) => ({
      ...place,
      type: place.save_type === "FAVORITE" ? "liked" : "pending",
    }));

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeSavedPlace = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { place_id, type } = req.body;

    if (!place_id || !type) {
      return res.status(400).json({
        success: false,
        message: "place_id and type are required",
      });
    }

    const typeMap = {
      liked: "FAVORITE",
      pending: "WISHLIST",
    };

    const save_type = typeMap[type];

    const [result] = await db.query(
      `
      DELETE FROM saved_places
      WHERE user_id = ? AND place_id = ? AND save_type = ?
      `,
      [user_id, place_id, save_type]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Saved place not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports ={
  savePlace,
  getSavedPlaces,
  removeSavedPlace
}