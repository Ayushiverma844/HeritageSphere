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
    let idColumn = "";

    if (type === "PLACE") {
      query = "SELECT place_id FROM places WHERE place_id = ?";
      idColumn = "place_id";
    } else {
      query = "SELECT story_id FROM stories WHERE story_id = ?";
      idColumn = "story_id";
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
      INSERT INTO saved_items
      (user_id,item_type,item_id)
      VALUES (?,?,?)
      `,
      [user_id, type, item_id]
    );

    res.status(201).json({
      success: true,
      message: `${type} saved successfully`,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
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
      p.short_description,
      p.best_time_to_visit,

      g.image_url AS cover_image,

      ROUND(AVG(r.rating),1) AS average_rating,
      COUNT(DISTINCT r.review_id) AS total_reviews

      FROM saved_items s

      JOIN places p
      ON s.item_id = p.place_id

      LEFT JOIN gallery g
      ON p.place_id = g.place_id
      AND g.is_cover = 1

      LEFT JOIN reviews r
      ON p.place_id = r.place_id

      WHERE
      s.user_id = ?
      AND s.item_type='PLACE'

      GROUP BY

      s.saved_id,
      p.place_id,
      g.image_url

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

      c.category_name,

      p.place_id,
      p.name AS place_name

      FROM saved_items s

      JOIN stories st
      ON s.item_id = st.story_id

      JOIN categories c
      ON st.category_id=c.category_id

      LEFT JOIN places p
      ON st.place_id=p.place_id

      WHERE
      s.user_id=?
      AND s.item_type='STORY'
      `,
      [user_id]
    );

    res.json({

      success: true,

      places,

      stories

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
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
      DELETE
      FROM saved_items

      WHERE

      user_id=?

      AND item_type=?

      AND item_id=?
      `,
      [user_id, type, item_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Saved item not found",
      });
    }

    res.json({
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

module.exports = {

  saveItem,

  getMyCollection,

  removeItem,

};