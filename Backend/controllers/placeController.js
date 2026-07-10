const db = require("../config/db");
const {
  uploadImage,
  deleteImage
} = require("../utils/cloudinaryHelper");

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




// Admin curd

// ==========================
// Get All Places (Admin)
// ==========================

const getAllPlacesAdmin = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 30,
      search = "",
      category = "",
      sort = "newest",
    } = req.query;

    // ==========================
    // Pagination
    // ==========================

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 30;
    }

    const offset = (page - 1) * limit;

    // ==========================
    // Base Query
    // ==========================

    let query = `
      SELECT
        p.place_id,
        p.name,
        p.city,
        p.state,
        p.country,
        p.image_url,
        p.entry_fee,
        c.category_name,
        p.created_at
      FROM places p
      JOIN categories c
        ON p.category_id = c.category_id
      WHERE 1 = 1
    `;

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM places p
      JOIN categories c
        ON p.category_id = c.category_id
      WHERE 1 = 1
    `;

    const values = [];

    // ==========================
    // Search
    // ==========================

    if (search.trim()) {
      query += `
        AND (
          p.name LIKE ?
          OR p.city LIKE ?
          OR p.state LIKE ?
        )
      `;

      countQuery += `
        AND (
          p.name LIKE ?
          OR p.city LIKE ?
          OR p.state LIKE ?
        )
      `;

      const keyword = `%${search.trim()}%`;

      values.push(keyword, keyword, keyword);
    }

    // ==========================
    // Category
    // ==========================

    if (category) {
      query += ` AND p.category_id = ? `;
      countQuery += ` AND p.category_id = ? `;

      values.push(category);
    }

    // ==========================
    // Sorting
    // ==========================

    switch (sort) {
      case "oldest":
        query += ` ORDER BY p.created_at ASC`;
        break;

      case "name":
        query += ` ORDER BY p.name ASC`;
        break;

      default:
        query += ` ORDER BY p.created_at DESC`;
        break;
    }

    // ==========================
    // Pagination
    // ==========================

    query += ` LIMIT ? OFFSET ?`;

    const [places] = await db.query(
      query,
      [...values, limit, offset]
    );

    const [countResult] = await db.query(
      countQuery,
      values
    );

    const totalPlaces = Number(countResult[0].total);
    const totalPages = Math.max(
      1,
      Math.ceil(totalPlaces / limit)
    );

    return res.status(200).json({
      success: true,

      pagination: {
        currentPage: page,
        totalPages,
        totalPlaces,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      places,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================
// Get Place By Id (Admin)
// ==========================

const getPlaceAdminById = async (req, res) => {

  try {

    const placeId = req.params.id;

    const [rows] = await db.query(

      `
      SELECT

        p.*,

        pd.detail_id,
        pd.short_description,
        pd.why_famous,
        pd.history,
        pd.architecture,
        pd.significance,
        pd.best_time_to_visit,
        pd.visiting_hours,
        pd.rituals,
        pd.how_to_reach,
        pd.travel_tips,
        pd.dress_code,
        pd.photography_allowed

      FROM places p

      LEFT JOIN place_detail pd
      ON p.place_id = pd.place_id

      WHERE p.place_id = ?

      LIMIT 1
      `,

      [placeId]

    );

    if (rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Place not found."

      });

    }

    res.status(200).json({

      success: true,

      place: rows[0]

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==========================
// Create Place (Admin)
// ==========================

const createPlace = async (req, res) => {
  
  let connection;
  let uploadedImage = null;

  try {

    const {

      category_id,

      name,
      city,
      state,
      country,

      entry_fee,

      latitude,
      longitude,

      short_description,
      why_famous,
      history,
      architecture,
      significance,

      best_time_to_visit,
      visiting_hours,

      rituals,

      how_to_reach,
      travel_tips,
      dress_code,

      photography_allowed

    } = req.body;

    // ==========================
    // Validation
    // ==========================

    if (
      !category_id ||
      !name ||
      !city ||
      !state ||
      !country
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Category, Name, City, State and Country are required."

      });

    }

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message: "Place image is required."

      });

    }

    // ==========================
    // Upload Image
    // ==========================

    uploadedImage = await uploadImage(

      req.file.buffer,

      "places"

    );

    // ==========================
    // Transaction
    // ==========================

    connection = await db.getConnection();

    await connection.beginTransaction();

    // ==========================
    // Insert Place
    // ==========================

    const [placeResult] = await connection.query(

      `
      INSERT INTO places (

        category_id,

        name,
        city,
        state,
        country,

        image_url,
        public_id,

        entry_fee,

        latitude,
        longitude

      )

      VALUES (

        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?

      )
      `,

      [

        category_id,

        name.trim(),
        city.trim(),
        state.trim(),
        country.trim(),

        uploadedImage.secure_url,
        uploadedImage.public_id,

        entry_fee || null,

        latitude || null,
        longitude || null

      ]

    );

    const placeId = placeResult.insertId;

    // ==========================
    // Insert Details
    // ==========================

    await connection.query(

      `
      INSERT INTO place_detail (

        place_id,

        short_description,
        why_famous,
        history,
        architecture,
        significance,

        best_time_to_visit,
        visiting_hours,

        rituals,

        how_to_reach,
        travel_tips,
        dress_code,

        photography_allowed

      )

      VALUES (

        ?,?,?,?,?,?,?,?,?,?,?,?,?

      )
      `,

      [

        placeId,

        short_description || null,
        why_famous || null,
        history || null,
        architecture || null,
        significance || null,

        best_time_to_visit || null,
        visiting_hours || null,

        rituals || null,

        how_to_reach || null,
        travel_tips || null,
        dress_code || null,

        photography_allowed || "Yes"

      ]

    );

    await connection.commit();

    connection.release();

    res.status(201).json({

      success: true,

      message: "Place created successfully.",

      placeId

    });

  }

  catch (error) {

    console.log(error);

    if (connection) {

      await connection.rollback();

      connection.release();

    }

    // delete uploaded image if DB failed

    if (uploadedImage?.public_id) {

      await deleteImage(uploadedImage.public_id);

    }

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ==========================
// Update Place (Admin)
// ==========================

const updatePlace = async (req, res) => {

  let connection;

  let uploadedImage = null;

  let oldPublicId = null;

  try {

    const placeId = req.params.id;

    const {

      category_id,

      name,
      city,
      state,
      country,

      entry_fee,

      latitude,
      longitude,

      short_description,
      why_famous,
      history,
      architecture,
      significance,

      best_time_to_visit,
      visiting_hours,

      rituals,

      how_to_reach,
      travel_tips,
      dress_code,

      photography_allowed

    } = req.body;

    // ==========================
    // Check Place
    // ==========================

    const [place] = await db.query(

      `
      SELECT
        image_url,
        public_id
      FROM places
      WHERE place_id=?
      `,

      [placeId]

    );

    if (place.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Place not found."

      });

    }

    let imageUrl = place[0].image_url;

    let publicId = place[0].public_id;

    // ==========================
    // Upload New Image
    // ==========================

    if (req.file) {

      uploadedImage = await uploadImage(

        req.file.buffer,

        "places"

      );

      imageUrl = uploadedImage.secure_url;

      publicId = uploadedImage.public_id;

      oldPublicId = place[0].public_id;

    }

    // ==========================
    // Transaction
    // ==========================

    connection = await db.getConnection();

    await connection.beginTransaction();

    // ==========================
    // Update Places
    // ==========================

    await connection.query(

      `
      UPDATE places

      SET

        category_id=?,

        name=?,
        city=?,
        state=?,
        country=?,

        image_url=?,
        public_id=?,

        entry_fee=?,

        latitude=?,
        longitude=?

      WHERE place_id=?
      `,

      [

        category_id,

        name.trim(),
        city.trim(),
        state.trim(),
        country.trim(),

        imageUrl,
        publicId,

        entry_fee || null,

        latitude || null,
        longitude || null,

        placeId

      ]

    );

    // ==========================
    // Update Details
    // ==========================

    await connection.query(

      `
      UPDATE place_detail

      SET

        short_description=?,
        why_famous=?,
        history=?,
        architecture=?,
        significance=?,

        best_time_to_visit=?,
        visiting_hours=?,

        rituals=?,

        how_to_reach=?,
        travel_tips=?,
        dress_code=?,

        photography_allowed=?

      WHERE place_id=?
      `,

      [

        short_description || null,
        why_famous || null,
        history || null,
        architecture || null,
        significance || null,

        best_time_to_visit || null,
        visiting_hours || null,

        rituals || null,

        how_to_reach || null,
        travel_tips || null,
        dress_code || null,

        photography_allowed || "Yes",

        placeId

      ]

    );

    await connection.commit();

    connection.release();

    // ==========================
    // Delete Old Image
    // ==========================

    if (oldPublicId) {

      await deleteImage(oldPublicId);

    }

    res.status(200).json({

      success: true,

      message: "Place updated successfully."

    });

  }

  catch (error) {

    console.log(error);

    if (connection) {

      await connection.rollback();

      connection.release();

    }

    // delete newly uploaded image

    if (uploadedImage?.public_id) {

      await deleteImage(uploadedImage.public_id);

    }

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==========================
// Delete Place (Admin)
// ==========================

const deletePlace = async (req, res) => {

  let connection;

  try {

    const placeId = req.params.id;

    // ==========================
    // Check Place
    // ==========================

    const [place] = await db.query(

      `
      SELECT
        public_id
      FROM places
      WHERE place_id=?
      `,

      [placeId]

    );

    if (place.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Place not found."

      });

    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    // ==========================
    // Delete Place
    // ==========================

    await connection.query(

      `
      DELETE FROM places
      WHERE place_id=?
      `,

      [placeId]

    );

    await connection.commit();

    connection.release();

    // ==========================
    // Delete Cloudinary Image
    // ==========================

    if (place[0].public_id) {

      await deleteImage(place[0].public_id);

    }

    res.json({

      success: true,

      message: "Place deleted successfully."

    });

  }

  catch (error) {

    console.log(error);

    if (connection) {

      await connection.rollback();

      connection.release();

    }

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


module.exports = {
  getPlaceDetails,
  getSimilarPlaces,
  getAllPlaces,

   getAllPlacesAdmin,
  getPlaceAdminById,
  createPlace,
  updatePlace,
  deletePlace
};