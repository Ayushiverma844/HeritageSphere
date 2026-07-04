const db = require("../config/db");
const getPlaceDetails = async (req, res) => {
  try {

    const placeId = req.params.id;

    // Place Basic Info
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
        message: "Place not found"
      });
    }

    // Place Detail
    const [details] = await db.query(
      `
      SELECT *
      FROM place_detail
      WHERE place_id = ?
      `,
      [placeId]
    );

    // Gallery
    const [gallery] = await db.query(
      `
      SELECT
      image_id,
      image_url,
      caption,
      is_cover
      FROM gallery
      WHERE place_id = ?
      ORDER BY is_cover DESC, image_id ASC      `,
      [placeId]
    );

    // Reviews
    const [reviews] = await db.query(
      `
      SELECT
      r.review_id,
      r.rating,
      r.comment,
      r.created_at,
      u.name
      FROM reviews r
      JOIN users u
      ON r.user_id = u.user_id
      WHERE r.place_id = ?
      ORDER BY r.created_at DESC
      `,
      [placeId]
    );

    // Average Rating and Total Reviews
    const [ratingData] = await db.query(
`
SELECT
ROUND(AVG(rating),1) AS averageRating,
COUNT(*) AS totalReviews
FROM reviews
WHERE place_id = ?
`,
[placeId]
);

    // Nearby Places
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
      ON np.nearby_place_id = p.place_id
      WHERE np.place_id = ?
      `,
      [placeId]
    );

   res.json({
  success: true,

  place: place[0],

  details: details[0] || {},

  gallery,

  reviews,

  nearby,

  rating: ratingData[0]
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
                g.image_url
            FROM places p

           LEFT JOIN (
    SELECT
        place_id,
        MAX(image_url) AS image_url
    FROM gallery
    WHERE is_cover = 1
    GROUP BY place_id
) g
ON p.place_id = g.place_id

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
                p.short_description,
                p.best_time_to_visit,

                c.category_name,

                g.image_url AS cover_image,

                ROUND(AVG(r.rating),1) AS average_rating,
                COUNT(DISTINCT r.review_id) AS total_reviews

            FROM places p

            JOIN categories c
            ON p.category_id = c.category_id

            LEFT JOIN gallery g
            ON p.place_id = g.place_id
            AND g.is_cover = 1

            LEFT JOIN reviews r
            ON p.place_id = r.place_id

            WHERE 1=1
        `;

        let countQuery = `
            SELECT COUNT(DISTINCT p.place_id) AS total

            FROM places p

            JOIN categories c
            ON p.category_id = c.category_id

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
                    OR p.short_description LIKE ?
                )
            `;

            countQuery += `
                AND (
                    p.name LIKE ?
                    OR p.city LIKE ?
                    OR p.state LIKE ?
                    OR p.short_description LIKE ?
                )
            `;

            values.push(`%${search}%`);
            values.push(`%${search}%`);
            values.push(`%${search}%`);
            values.push(`%${search}%`);

        }

        // Category

        if (category) {

            query += " AND c.category_name = ?";
            countQuery += " AND c.category_name = ?";

            values.push(category);

        }

        // State

        if (state) {

            query += " AND p.state = ?";
            countQuery += " AND p.state = ?";

            values.push(state);

        }

        // City

        if (city) {

            query += " AND p.city = ?";
            countQuery += " AND p.city = ?";

            values.push(city);

        }

        query += `
           GROUP BY

p.place_id,
p.name,
p.city,
p.state,
p.country,
p.short_description,
p.best_time_to_visit,
c.category_name,
g.image_url
        `;

        // Sorting

        switch (sort) {

            case "oldest":

                query += " ORDER BY p.created_at ASC";
                break;

            case "name":

                query += " ORDER BY p.name ASC";
                break;

            default:

                query += " ORDER BY p.created_at DESC";

        }

        query += " LIMIT ? OFFSET ?";

        const dataValues = [...values, limit, offset];

        const [places] = await db.query(
            query,
            dataValues
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

                hasNextPage:
                    page < Math.ceil(totalPlaces / limit),

                hasPreviousPage:
                    page > 1

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