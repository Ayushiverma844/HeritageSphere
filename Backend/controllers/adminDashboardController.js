const db = require("../config/db");

// ==========================================
// Helper : Dashboard Statistics
// ==========================================
const getStatistics = async () => {

    const [
        [users],
        [places],
        [stories],
        [reviews],
        [categories],
        [savedPlaces],
        [todayUsers],
        [thisMonthPlaces],
        [avgRating]
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
            SELECT COUNT(*) AS totalReviews
            FROM reviews
        `),

        db.query(`
            SELECT COUNT(*) AS totalCategories
            FROM categories
        `),

        db.query(`
            SELECT COUNT(*) AS totalSavedPlaces
            FROM saved_places
        `),

        db.query(`
            SELECT COUNT(*) AS todayUsers
            FROM users
            WHERE DATE(created_at)=CURDATE()
        `),

        db.query(`
            SELECT COUNT(*) AS thisMonthPlaces
            FROM places
            WHERE MONTH(created_at)=MONTH(CURDATE())
            AND YEAR(created_at)=YEAR(CURDATE())
        `),

        db.query(`
            SELECT
                ROUND(AVG(rating),1) AS averageRating
            FROM reviews
        `)

    ]);

    return {

        totalUsers: users[0].totalUsers,

        totalPlaces: places[0].totalPlaces,

        totalStories: stories[0].totalStories,

        totalReviews: reviews[0].totalReviews,

        totalCategories: categories[0].totalCategories,

        totalSavedPlaces: savedPlaces[0].totalSavedPlaces,

        todayUsers: todayUsers[0].todayUsers,

        thisMonthPlaces: thisMonthPlaces[0].thisMonthPlaces,

        averageRating: Number(avgRating[0].averageRating) || 0

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
// Complete Dashboard API
// ==========================================
const getDashboard = async (req, res) => {

    try {

        const statistics = await getStatistics();

        res.status(200).json({

            success: true,

            dashboard: {

                statistics,

                summary: {

                    totalContent:
                        statistics.totalPlaces +
                        statistics.totalStories,

                    engagement:

                        statistics.totalReviews +
                        statistics.totalSavedPlaces

                }

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
    Math.max(parseInt(req.query.limit) || 5, 1),
    100
);
        const search = (req.query.search || "").trim();
        const sort =
            req.query.sort?.toUpperCase() === "ASC"
                ? "ASC"
                : "DESC";

        const offset = (page - 1) * limit;

        let whereClause = "";
        const values = [];

        if (search) {

            whereClause = `
                WHERE
                    name LIKE ?
                    OR email LIKE ?
            `;

            values.push(
                `%${search}%`,
                `%${search}%`
            );

        }

        // =========================
        // Total Users
        // =========================

        const [countResult] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM users
            ${whereClause}
            `,
            values
        );

        const total = countResult[0].total;

        // =========================
        // Fetch Users
        // =========================

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

            pagination: {

                totalRecords: total,

                currentPage: page,

                totalPages: Math.ceil(total / limit),

                pageSize:limit,

                hasNextPage:page < Math.ceil(total/limit),

                hasPreviousPage:page>1

            },

            users

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
    Math.max(parseInt(req.query.limit) || 5, 1),
    100
);
        const offset = (page - 1) * limit;

        const search = (req.query.search || "").trim();
        const category = req.query.category || "";
        const sort =
            req.query.sort?.toUpperCase() === "ASC"
                ? "ASC"
                : "DESC";

        let whereClause = "WHERE 1=1";

        const values = [];

        // Search
        if (search) {

            whereClause += `
            AND (
                p.name LIKE ?
                OR p.city LIKE ?
                OR p.state LIKE ?
            )
            `;

            values.push(
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            );

        }

        // Category Filter
        if (category) {

            whereClause += `
            AND c.category_name = ?
            `;

            values.push(category);

        }

        // ============================
        // Total Count
        // ============================

        const [countResult] = await db.query(
            `
            SELECT COUNT(*) AS total

            FROM places p

            JOIN categories c
            ON p.category_id = c.category_id

            ${whereClause}
            `,
            values
        );

        const total = countResult[0].total;

        // ============================
        // Fetch Places
        // ============================

        const [places] = await db.query(
            `
            SELECT

                p.place_id,

                p.name,

                p.city,

                p.state,

                p.country,

                p.short_description,

                c.category_name,

                (
                    SELECT image_url
                    FROM gallery g
                    WHERE g.place_id = p.place_id
                    AND g.is_cover = 1
                    LIMIT 1
                ) AS cover_image,

                p.created_at

            FROM places p

            JOIN categories c
            ON p.category_id = c.category_id

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

           
            pagination: {

                totalRecords: total,

                currentPage: page,

                totalPages: Math.ceil(total / limit),

                pageSize:limit,

                hasNextPage:page < Math.ceil(total/limit),

                hasPreviousPage:page>1

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

// ==========================================
// Recent Stories
// ==========================================
const getRecentStories = async (req, res) => {

    try {

        
        const page = Math.max(parseInt(req.query.page) || 1, 1);

const limit = Math.min(
    Math.max(parseInt(req.query.limit) || 5, 1),
    100
);
        const offset = (page - 1) * limit;

        const search = (req.query.search || "").trim();
        const category = req.query.category || "";
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
            SELECT
                COUNT(*) AS total

            FROM stories s

            JOIN categories c
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

                s.summary,

                s.source_name,

                s.source_url,

                s.created_at,

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

            
            pagination: {

                totalRecords: total,

                currentPage: page,

                totalPages: Math.ceil(total / limit),

                pageSize:limit,

                hasNextPage:page < Math.ceil(total/limit),

                hasPreviousPage:page>1

            },

            stories

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
// Recent Reviews
// ==========================================
const getRecentReviews = async (req, res) => {

    try {

    
        const page = Math.max(parseInt(req.query.page) || 1, 1);

const limit = Math.min(
    Math.max(parseInt(req.query.limit) || 5, 1),
    100
);
        const offset = (page - 1) * limit;

        const search = (req.query.search || "").trim();
        const rating = parseInt(req.query.rating);

if (rating && (rating < 1 || rating > 5)) {

    return res.status(400).json({

        success:false,

        message:"Rating must be between 1 and 5"

    });

}

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
                    u.name LIKE ?
                    OR p.name LIKE ?
                    OR r.comment LIKE ?
                )
            `;

            values.push(
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            );

        }

        // ==========================
        // Rating Filter
        // ==========================

        if (rating) {

            whereClause += `
                AND r.rating = ?
            `;

            values.push(rating);

        }

        // ==========================
        // Total Records
        // ==========================

        const [countResult] = await db.query(
            `
            SELECT
                COUNT(*) AS total

            FROM reviews r

            JOIN users u
            ON r.user_id = u.user_id

            JOIN places p
            ON r.place_id = p.place_id

            ${whereClause}
            `,
            values
        );

        const total = countResult[0].total;

        // ==========================
        // Reviews
        // ==========================

        const [reviews] = await db.query(
            `
            SELECT

                r.review_id,

                r.rating,

                r.comment,

                r.created_at,

                u.user_id,

                u.name AS user_name,

                p.place_id,

                p.name AS place_name

            FROM reviews r

            JOIN users u
            ON r.user_id = u.user_id

            JOIN places p
            ON r.place_id = p.place_id

            ${whereClause}

            ORDER BY r.created_at ${sort}

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

            
            pagination: {

                totalRecords: total,

                currentPage: page,

                totalPages: Math.ceil(total / limit),

                pageSize:limit,

                hasNextPage:page < Math.ceil(total/limit),

                hasPreviousPage:page>1

            },

            reviews

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

    getDashboard,

    getRecentUsers,

    getRecentPlaces,

    getRecentStories,

    getRecentReviews

};