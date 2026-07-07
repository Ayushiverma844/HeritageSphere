const db = require("../config/db");

// ==========================================
// Dashboard Statistics Helper
// ==========================================

const getStatistics = async () => {
  const [
    [users],
    [places],
    [stories],
    [categories],
    [savedItems],
  ] = await Promise.all([

    db.query(`
      SELECT COUNT(*) AS totalUsers
      FROM users
    `),

    db.query(`
      SELECT COUNT(*) AS totalPlaces
      FROM places
    `),

    db.query(`
      SELECT COUNT(*) AS totalStories
      FROM stories
    `),

    db.query(`
      SELECT COUNT(*) AS totalCategories
      FROM categories
    `),

    db.query(`
      SELECT COUNT(*) AS totalSavedItems
      FROM saved_items
    `)

  ]);

  return {

    totalUsers: users[0].totalUsers,

    totalPlaces: places[0].totalPlaces,

    totalStories: stories[0].totalStories,

    totalCategories: categories[0].totalCategories,

    totalSavedItems: savedItems[0].totalSavedItems

  };
};


// ==========================================
// Dashboard Statistics API
// ==========================================

const getDashboardStats = async (req, res) => {

  try {

    const statistics = await getStatistics();

    res.status(200).json({

      success: true,

      statistics

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ==========================================
// Dashboard Analytics
// ==========================================

const getDashboardAnalytics = async (req, res) => {

    try {

        // ==========================
        // Most Saved Places
        // ==========================

        const [mostSavedPlaces] = await db.query(`

            SELECT

                p.place_id,

                p.name,

                p.city,

                p.state,

                p.image_url,

                COUNT(si.saved_id) AS total_saves

            FROM saved_items si

            INNER JOIN places p
                ON p.place_id = si.item_id

            WHERE si.item_type = 'PLACE'

            GROUP BY
                p.place_id,
                p.name,
                p.city,
                p.state,
                p.image_url

            ORDER BY total_saves DESC

            LIMIT 5

        `);

        // ==========================
        // Most Read Stories
        // (Temporary)
        // Replace ORDER BY when views column exists
        // ==========================

        const [mostReadStories] = await db.query(`

            SELECT

                story_id,

                title,

                slug,

                cover_image,

                total_chapters,

                created_at

            FROM stories

            ORDER BY created_at DESC

            LIMIT 5

        `);

        // ==========================
        // Recent User Activity
        // ==========================

        const [recentUsers] = await db.query(`

            SELECT

                user_id,

                name,

                email,

                city,

                state,

                created_at

            FROM users

            ORDER BY created_at DESC

            LIMIT 5

        `);

        res.status(200).json({

            success: true,

            analytics: {

                mostSavedPlaces,

                mostReadStories,

                recentUsers

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================================
// Recent Users
// ==========================================

const getRecentUsers = async (req, res) => {

    try {

        const page = Math.max(parseInt(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const offset = (page - 1) * limit;

        const search = (req.query.search || "").trim();

        const sort =
            req.query.sort?.toUpperCase() === "ASC"
                ? "ASC"
                : "DESC";

        let whereClause = "";

        const values = [];

        // ==========================
        // Search
        // ==========================

        if (search) {

            whereClause = `
                WHERE
                    name LIKE ?
                    OR email LIKE ?
                    OR city LIKE ?
                    OR state LIKE ?
            `;

            values.push(
                `%${search}%`,
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            );

        }

        // ==========================
        // Total Records
        // ==========================

        const [countResult] = await db.query(

            `
            SELECT COUNT(*) AS total

            FROM users

            ${whereClause}
            `,

            values

        );

        const total = countResult[0].total;

        // ==========================
        // Users
        // ==========================

        const [users] = await db.query(

            `
            SELECT

                user_id,

                name,

                email,

                role,

                mobile_number,

                city,

                state,

                country,

                profile_image,

                created_at

            FROM users

            ${whereClause}

            ORDER BY created_at ${sort}

            LIMIT ?

            OFFSET ?
            `,

            [
                ...values,
                limit,
                offset
            ]

        );

        res.status(200).json({

            success: true,

            users,

            pagination: {

                totalRecords: total,

                currentPage: page,

                totalPages: Math.ceil(total / limit),

                pageSize: limit,

                hasNextPage: page < Math.ceil(total / limit),

                hasPreviousPage: page > 1

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================================
// Recent Places
// ==========================================

const getRecentPlaces = async (req, res) => {

    try {

        const page = Math.max(parseInt(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const offset = (page - 1) * limit;

        const search = (req.query.search || "").trim();

        const category = (req.query.category || "").trim();

        const sort =
            req.query.sort?.toUpperCase() === "ASC"
                ? "ASC"
                : "DESC";

        let whereClause = "WHERE 1=1";

        const values = [];

        // ==========================
        // Search
        // ==========================

        if (search) {

            whereClause += `
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

        // ==========================
        // Category Filter
        // ==========================

        if (category) {

            whereClause += `
                AND c.category_name = ?
            `;

            values.push(category);

        }

        // ==========================
        // Total Records
        // ==========================

        const [countResult] = await db.query(

            `
            SELECT COUNT(*) AS total

            FROM places p

            INNER JOIN categories c
                ON p.category_id = c.category_id

            LEFT JOIN place_detail pd
                ON p.place_id = pd.place_id

            ${whereClause}
            `,

            values

        );

        const total = countResult[0].total;

        // ==========================
        // Fetch Places
        // ==========================

        const [places] = await db.query(

            `
            SELECT

                p.place_id,

                p.name,

                p.city,

                p.state,

                p.country,

                p.image_url,

                p.entry_fee,

                p.created_at,

                c.category_name,

                pd.short_description,

                pd.best_time_to_visit

            FROM places p

            INNER JOIN categories c
                ON p.category_id = c.category_id

            LEFT JOIN place_detail pd
                ON p.place_id = pd.place_id

            ${whereClause}

            ORDER BY p.created_at ${sort}

            LIMIT ?

            OFFSET ?
            `,

            [
                ...values,
                limit,
                offset
            ]

        );

        res.status(200).json({

            success: true,

            places,

            pagination: {

                totalRecords: total,

                currentPage: page,

                totalPages: Math.ceil(total / limit),

                pageSize: limit,

                hasNextPage: page < Math.ceil(total / limit),

                hasPreviousPage: page > 1

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================================
// Recent Stories
// ==========================================

const getRecentStories = async (req, res) => {

    try {

        const page = Math.max(parseInt(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const offset = (page - 1) * limit;

        const search = (req.query.search || "").trim();

        const category = (req.query.category || "").trim();

        const sort =
            req.query.sort?.toUpperCase() === "ASC"
                ? "ASC"
                : "DESC";

        let whereClause = "WHERE 1=1";

        const values = [];

        // ==========================
        // Search
        // ==========================

        if (search) {

            whereClause += `
                AND (
                    s.title LIKE ?
                    OR s.summary LIKE ?
                    OR p.name LIKE ?
                )
            `;

            values.push(
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            );

        }

        // ==========================
        // Category Filter
        // ==========================

        if (category) {

            whereClause += `
                AND c.category_name = ?
            `;

            values.push(category);

        }

        // ==========================
        // Total Records
        // ==========================

        const [countResult] = await db.query(

            `
            SELECT COUNT(*) AS total

            FROM stories s

            INNER JOIN categories c
                ON s.category_id = c.category_id

            LEFT JOIN places p
                ON s.place_id = p.place_id

            ${whereClause}
            `,

            values

        );

        const total = countResult[0].total;

        // ==========================
        // Stories
        // ==========================

        const [stories] = await db.query(

            `
            SELECT

                s.story_id,

                s.title,

                s.slug,

                s.summary,

                s.cover_image,

                s.total_chapters,

                s.source_name,

                s.source_url,

                s.created_at,

                c.category_name,

                p.place_id,

                p.name AS place_name,

                p.city,

                p.state

            FROM stories s

            INNER JOIN categories c
                ON s.category_id = c.category_id

            LEFT JOIN places p
                ON s.place_id = p.place_id

            ${whereClause}

            ORDER BY s.created_at ${sort}

            LIMIT ?

            OFFSET ?
            `,

            [
                ...values,
                limit,
                offset
            ]

        );

        res.status(200).json({

            success: true,

            stories,

            pagination: {

                totalRecords: total,

                currentPage: page,

                totalPages: Math.ceil(total / limit),

                pageSize: limit,

                hasNextPage: page < Math.ceil(total / limit),

                hasPreviousPage: page > 1

            }

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

    getDashboardStats,

    getDashboardAnalytics,

    getRecentUsers,

    getRecentPlaces,

    getRecentStories

};