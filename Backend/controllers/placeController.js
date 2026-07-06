const db = require("../config/db");

const getPlaceDetails = async (req, res) => {
  try {

    const placeId = req.params.id;

    // agar login hai to middleware req.user bhej dega
    const currentUserId = req.user?.id || null;

    // ==========================================
    // Place
    // ==========================================

    const [place] = await db.query(
      `
      SELECT
        p.*,
        c.category_name
      FROM places p
      JOIN categories c
      ON p.category_id = c.category_id
      WHERE p.place_id = ?
      `,
      [placeId]
    );

    if (place.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // ==========================================
    // Details
    // ==========================================

    const [details] = await db.query(
      `
      SELECT *
      FROM place_detail
      WHERE place_id = ?
      `,
      [placeId]
    );

    // ==========================================
    // Gallery
    // ==========================================

    const [gallery] = await db.query(
      `
      SELECT
        image_id,
        image_url,
        caption,
        is_cover
      FROM gallery
      WHERE place_id = ?
      ORDER BY is_cover DESC,image_id ASC
      `,
      [placeId]
    );

    // ==========================================
    // Reviews
    // ==========================================

    const [reviews] = await db.query(
      `
      SELECT
        r.review_id,
        r.user_id,
        r.rating,
        r.comment,
        r.created_at,
        u.name
      FROM reviews r
      JOIN users u
      ON r.user_id=u.user_id
      WHERE r.place_id=?
      ORDER BY r.created_at DESC
      `,
      [placeId]
    );

    // ==========================================
    // My Review
    // ==========================================

    let myReview = null;

    if (currentUserId) {

      const [mine] = await db.query(
        `
        SELECT
          review_id,
          place_id,
          rating,
          comment,
          created_at
        FROM reviews
        WHERE place_id=?
        AND user_id=?
        LIMIT 1
        `,
        [placeId, currentUserId]
      );

      myReview = mine[0] || null;
    }

    // ==========================================
    // Rating Summary
    // ==========================================

    const [ratingData] = await db.query(
      `
      SELECT
      ROUND(AVG(rating),1) AS averageRating,
      COUNT(*) AS totalReviews
      FROM reviews
      WHERE place_id=?
      `,
      [placeId]
    );

    // ==========================================
    // Nearby
    // ==========================================

    const [nearby] = await db.query(
      `
      SELECT
        np.distance_km,
        p.place_id,
        p.name,
        p.city,
        p.state
      FROM nearby_places np
      JOIN places p
      ON np.nearby_place_id=p.place_id
      WHERE np.place_id=?
      `,
      [placeId]
    );

    // ==========================================
    // Story
    // ==========================================

    const [story] = await db.query(
      `
      SELECT
        story_id,
        slug,
        title,
        summary
      FROM stories
      WHERE place_id=?
      LIMIT 1
      `,
      [placeId]
    );

    // ==========================================
    // Response
    // ==========================================

    res.json({

      success: true,

      place: place[0],

      details: details[0] || {},

      gallery,

      reviews,

      myReview,

      nearby,

      rating: ratingData[0],

      story: story[0] || null

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }
};


const  getSimilarPlaces = async (req, res) => {

    try {

        const placeId = req.params.id;

        // Find current place category
        const [currentPlace] = await db.query(
            `
            SELECT category_id
            FROM places
            WHERE place_id = ?
            `,
            [placeId]
        );

        if (currentPlace.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }

        const categoryId = currentPlace[0].category_id;

        // Get similar places
        const [places] = await db.query(
            `
          SELECT
    p.place_id,
    p.name,
    p.city,
    p.state,
    p.image_url
FROM places p

            WHERE p.category_id = ?
            AND p.place_id <> ?

            LIMIT 4
            `,
            [categoryId, placeId]
        );

        res.json({
            success: true,
            similarPlaces: places
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Get All Places
// ==========================

const getAllPlaces = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 9,
      search,
      category,
      state,
      city,
      sort = "newest"
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 9;

    const offset = (page - 1) * limit;

    let query = `
      SELECT
        p.place_id,
        p.name,
        p.city,
        p.state,
        p.country,
        p.image_url,
        p.entry_fee,

        ROUND(AVG(r.rating), 1) AS average_rating,

        pd.short_description,
        pd.best_time_to_visit,

        c.category_name

      FROM places p

      JOIN categories c
      ON p.category_id = c.category_id

      LEFT JOIN place_detail pd
      ON p.place_id = pd.place_id

      LEFT JOIN reviews r
      ON p.place_id = r.place_id

      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) AS total

      FROM places p

      JOIN categories c
      ON p.category_id = c.category_id

      LEFT JOIN place_detail pd
      ON p.place_id = pd.place_id

      WHERE 1=1
    `;

    const values = [];

    // Search
    if (search) {
      query += `
        AND (
          p.name LIKE ?
          OR p.city LIKE ?
          OR p.state LIKE ?
          OR pd.short_description LIKE ?
        )
      `;

      countQuery += `
        AND (
          p.name LIKE ?
          OR p.city LIKE ?
          OR p.state LIKE ?
          OR pd.short_description LIKE ?
        )
      `;

      values.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    // Category
    if (category) {
      query += ` AND c.category_name = ? `;
      countQuery += ` AND c.category_name = ? `;

      values.push(category);
    }

    // State
    if (state) {
      query += ` AND p.state = ? `;
      countQuery += ` AND p.state = ? `;

      values.push(state);
    }

    // City
    if (city) {
      query += ` AND p.city = ? `;
      countQuery += ` AND p.city = ? `;

      values.push(city);
    }

    // GROUP BY before ORDER BY
    query += `
      GROUP BY
        p.place_id,
        p.name,
        p.city,
        p.state,
        p.country,
        p.image_url,
        p.entry_fee,
        pd.short_description,
        pd.best_time_to_visit,
        c.category_name,
        p.created_at
    `;

    switch (sort) {
      case "oldest":
        query += ` ORDER BY p.created_at ASC`;
        break;

      case "name":
        query += ` ORDER BY p.name ASC`;
        break;

      default:
        query += ` ORDER BY p.created_at DESC`;
    }

    query += ` LIMIT ? OFFSET ?`;

    const [places] = await db.query(
      query,
      [...values, limit, offset]
    );

    const [count] = await db.query(
      countQuery,
      values
    );

    const totalPlaces = count[0].total;

    res.json({
      success: true,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPlaces / limit),
        totalPlaces,
        limit,
        hasNextPage: page < Math.ceil(totalPlaces / limit),
        hasPreviousPage: page > 1
      },

      places
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
  getPlaceDetails,
  getSimilarPlaces,
  getAllPlaces
};