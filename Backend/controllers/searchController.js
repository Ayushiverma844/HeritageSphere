const db = require("../config/db");

const globalSearch = async (req, res) => {
  try {

    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // ===========================
    // Search Places
    // ===========================

    const [places] = await db.query(
      `
      SELECT
        place_id,
        name
      FROM places
      WHERE
        name LIKE ?
        OR city LIKE ?
        OR state LIKE ?
      LIMIT 1
      `,
      [
        `%${q}%`,
        `%${q}%`,
        `%${q}%`,
      ]
    );

    if (places.length > 0) {
      return res.json({
        success: true,
        type: "PLACE",
      });
    }

    // ===========================
    // Search Stories
    // ===========================

    const [stories] = await db.query(
      `
      SELECT
        story_id,
        title
      FROM stories
      WHERE
        title LIKE ?
        OR summary LIKE ?
      LIMIT 1
      `,
      [
        `%${q}%`,
        `%${q}%`,
      ]
    );

    if (stories.length > 0) {
      return res.json({
        success: true,
        type: "STORY",
      });
    }

    // ===========================

    return res.json({
      success: true,
      type: "NONE",
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
  globalSearch,
};