const db = require("../config/db");

// ======================================
// Save Item (Place / Story)
// ======================================

const saveItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { item_type, item_id } = req.body;

    if (!item_type || !item_id) {
      return res.status(400).json({
        success: false,
        message: "item_type and item_id are required",
      });
    }

    const type = item_type.toUpperCase();

    if (!["PLACE", "STORY"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "item_type must be PLACE or STORY",
      });
    }

    // ===========================
    // Check item exists
    // ===========================

    let query = "";

    if (type === "PLACE") {
      query = "SELECT place_id FROM places WHERE place_id = ?";
    } else {
      query = "SELECT story_id FROM stories WHERE story_id = ?";
    }

    const [item] = await db.query(query, [item_id]);

    if (item.length === 0) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`,
      });
    }

    // ===========================
    // Duplicate check
    // ===========================

    const [existing] = await db.query(
      `
      SELECT saved_id
      FROM saved_items
      WHERE user_id = ?
        AND item_type = ?
        AND item_id = ?
      `,
      [user_id, type, item_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Item already saved",
      });
    }

    // ===========================
    // Insert
    // ===========================

    await db.query(
      `
      INSERT INTO saved_items (user_id, item_type, item_id)
      VALUES (?, ?, ?)
      `,
      [user_id, type, item_id]
    );

    return res.status(201).json({
      success: true,
      message: `${type} saved successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Collection
// ======================================

const getMyCollection = async (req, res) => {
  try {
    const user_id = req.user.id;

    // =======================
    // Saved Places
    // =======================

    const [places] = await db.query(
      `
      SELECT
        s.saved_id,
        s.item_type,
        s.created_at,

        p.place_id,
        p.name,
        p.city,
        p.state,
        p.country,
        p.image_url AS cover_image,
        p.entry_fee,
        p.latitude,
        p.longitude,

        COALESCE(pd.short_description, 'No description available') AS short_description,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(DISTINCT r.review_id) AS total_reviews

      FROM saved_items s

      JOIN places p
        ON s.item_id = p.place_id

        LEFT JOIN place_detail pd
  ON p.place_id = pd.place_id

      LEFT JOIN reviews r
        ON p.place_id = r.place_id

      WHERE s.user_id = ?
        AND s.item_type = 'PLACE'

      GROUP BY
        s.saved_id,
        p.place_id,
          pd.short_description
      `,
      [user_id]
    );

    // =======================
    // Saved Stories
    // =======================

    const [stories] = await db.query(
      `
      SELECT
        s.saved_id,
        s.item_type,
        s.created_at,

        st.story_id,
        st.title,
        st.summary,
        st.slug,

        c.category_name,

        p.place_id,
        p.name AS place_name

      FROM saved_items s

      JOIN stories st
        ON s.item_id = st.story_id

      JOIN categories c
        ON st.category_id = c.category_id

      LEFT JOIN places p
        ON st.place_id = p.place_id

      WHERE s.user_id = ?
        AND s.item_type = 'STORY'
      `,
      [user_id]
    );

    return res.json({
      success: true,
      places,
      stories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Remove Item
// ======================================

const removeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { item_type, item_id } = req.body;

    if (!item_type || !item_id) {
      return res.status(400).json({
        success: false,
        message: "item_type and item_id are required",
      });
    }

    const type = item_type.toUpperCase();

    const [result] = await db.query(
      `
      DELETE FROM saved_items
      WHERE user_id = ?
        AND item_type = ?
        AND item_id = ?
      `,
      [user_id, type, item_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Saved item not found",
      });
    }

    return res.json({
      success: true,
      message: "Removed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveItem,
  getMyCollection,
  removeItem,
};