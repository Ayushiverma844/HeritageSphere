const db = require("../config/db");

// ==========================
// Get All Stories (FINAL)
// ==========================
const getAllStories = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      category,
      search,
      sort = "newest",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM stories s
      JOIN categories c
        ON s.category_id = c.category_id
      LEFT JOIN places p
        ON s.place_id = p.place_id
      WHERE 1=1
    `;

    const values = [];

    // ======================
    // Filters
    // ======================

    if (category) {
      baseQuery += ` AND c.category_name = ? `;
      values.push(category);
    }

    if (search) {
      baseQuery += `
        AND (
          s.title LIKE ?
          OR s.summary LIKE ?
          OR c.category_name LIKE ?
          OR p.name LIKE ?
          OR s.source_name LIKE ?
        )
      `;

      values.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    // ======================
    // Count Query
    // ======================

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total ${baseQuery}`,
      values
    );

    const totalStories = countResult[0].total;

    // ======================
    // Sorting
    // ======================

    let orderBy = "ORDER BY s.created_at DESC";

    if (sort === "oldest") {
      orderBy = "ORDER BY s.created_at ASC";
    } else if (sort === "title") {
      orderBy = "ORDER BY s.title ASC";
    }

    // ======================
    // Main Query
    // ======================

    const [stories] = await db.query(
      `
      SELECT
        s.story_id,
        s.place_id,
        s.slug,
        s.title,
        s.summary,
        s.cover_image,
        s.total_chapters,
        s.source_name,
        s.source_url,
        s.created_at,
          s.source_name,

        c.category_id,
        c.category_name,

        p.name AS place_name

      ${baseQuery}
      ${orderBy}
      LIMIT ? OFFSET ?
      `,
      [...values, limit, offset]
    );

    res.json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalStories / limit),
        totalStories,
        limit,
        hasNextPage: page < Math.ceil(totalStories / limit),
        hasPreviousPage: page > 1,
      },
      stories,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Story Details (FINAL)
// ==========================
const getStoryDetails = async (req, res) => {
  try {
    const slug = req.params.slug;

    const [story] = await db.query(
      `
      SELECT
        s.story_id,
        s.place_id,
        s.slug,
        s.title,
        s.summary,
        s.cover_image,
        s.total_chapters,
        s.source_name,
        s.source_url,
        s.created_at,
        s.updated_at,

        c.category_id,
        c.category_name,

        p.place_id,
        p.name AS place_name,
        p.city,
        p.state

      FROM stories s

      JOIN categories c
        ON s.category_id = c.category_id

      LEFT JOIN places p
        ON s.place_id = p.place_id

      WHERE s.slug = ?
      `,
      [slug]
    );

    if (story.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      story: story[0],
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
  getAllStories,
  getStoryDetails,
};