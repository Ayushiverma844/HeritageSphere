const db = require("../config/db");

// ==========================
// Get All Categories
// ==========================
const getAllCategories = async (req, res) => {

    try {

        let {
            page = 1,
            limit = 20,
            search,
            usage_type,
            sort = "name"
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 20;

        const offset = (page - 1) * limit;

        let query = `
            SELECT
                category_id,
                category_name,
                usage_type,
                created_at
            FROM categories
            WHERE 1=1
        `;

        let countQuery = `
            SELECT COUNT(*) AS total
            FROM categories
            WHERE 1=1
        `;

        const values = [];

        // Search

        if (search) {

            query += " AND category_name LIKE ?";
            countQuery += " AND category_name LIKE ?";

            values.push(`%${search}%`);

        }

        // Usage Type

        if (usage_type) {

            query += " AND usage_type = ?";
            countQuery += " AND usage_type = ?";

            values.push(usage_type);

        }

        // Sorting

        switch (sort) {

            case "newest":
                query += " ORDER BY created_at DESC";
                break;

            case "oldest":
                query += " ORDER BY created_at ASC";
                break;

            default:
                query += " ORDER BY category_name ASC";

        }

        query += " LIMIT ? OFFSET ?";

        const [categories] = await db.query(
            query,
            [...values, limit, offset]
        );

        const [count] = await db.query(
            countQuery,
            values
        );

        const totalCategories = count[0].total;

        res.status(200).json({

            success: true,

            pagination: {

                currentPage: page,
                totalPages: Math.ceil(totalCategories / limit),
                totalCategories,
                limit,
                hasNextPage: page < Math.ceil(totalCategories / limit),
                hasPreviousPage: page > 1

            },

            categories

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
// Get Category By ID
// ==========================
const getCategoryById = async (req, res) => {

    try {

        const id = req.params.id;

        const [category] = await db.query(
            `
            SELECT *
            FROM categories
            WHERE category_id = ?
            `,
            [id]
        );

        if (category.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Category not found"

            });

        }

        res.json({

            success: true,
            category: category[0]

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
// Create Category
// ==========================
const createCategory = async (req, res) => {

    try {

        let {
            category_name,
            usage_type
        } = req.body;

        if (!category_name || !usage_type) {

            return res.status(400).json({

                success: false,
                message: "Category Name and Usage Type are required."

            });

        }

        category_name = category_name.trim();

        usage_type = usage_type.toUpperCase();

        if (!["PLACE", "STORY", "BOTH"].includes(usage_type)) {

            return res.status(400).json({

                success: false,
                message: "Invalid Usage Type"

            });

        }

        const [existing] = await db.query(
            `
            SELECT category_id
            FROM categories
            WHERE category_name = ?
            `,
            [category_name]
        );

        if (existing.length > 0) {

            return res.status(400).json({

                success: false,
                message: "Category already exists."

            });

        }

        const [result] = await db.query(
            `
            INSERT INTO categories
            (category_name, usage_type)
            VALUES (?, ?)
            `,
            [
                category_name,
                usage_type
            ]
        );

        res.status(201).json({

            success: true,
            message: "Category Created Successfully",
            categoryId: result.insertId

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
// Update Category
// ==========================
const updateCategory = async (req, res) => {

    try {

        const id = req.params.id;

        let {
            category_name,
            usage_type
        } = req.body;

        const [category] = await db.query(
            `
            SELECT *
            FROM categories
            WHERE category_id = ?
            `,
            [id]
        );

        if (category.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Category not found"

            });

        }

        category_name = category_name.trim();

        usage_type = usage_type.toUpperCase();

        if (!["PLACE", "STORY", "BOTH"].includes(usage_type)) {

            return res.status(400).json({

                success: false,
                message: "Invalid Usage Type"

            });

        }

        const [duplicate] = await db.query(
            `
            SELECT category_id
            FROM categories
            WHERE category_name = ?
            AND category_id <> ?
            `,
            [
                category_name,
                id
            ]
        );

        if (duplicate.length > 0) {

            return res.status(400).json({

                success: false,
                message: "Category already exists."

            });

        }

        await db.query(
            `
            UPDATE categories
            SET
                category_name = ?,
                usage_type = ?
            WHERE category_id = ?
            `,
            [
                category_name,
                usage_type,
                id
            ]
        );

        res.json({

            success: true,
            message: "Category Updated Successfully"

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
// Delete Category
// ==========================
const deleteCategory = async (req, res) => {

    try {

        const id = req.params.id;

        // Check if used by places

        const [places] = await db.query(
            `
            SELECT place_id
            FROM places
            WHERE category_id = ?
            LIMIT 1
            `,
            [id]
        );

        if (places.length > 0) {

            return res.status(400).json({

                success: false,
                message: "Category is used by places."

            });

        }

        // Check if used by stories

        const [stories] = await db.query(
            `
            SELECT story_id
            FROM stories
            WHERE category_id = ?
            LIMIT 1
            `,
            [id]
        );

        if (stories.length > 0) {

            return res.status(400).json({

                success: false,
                message: "Category is used by stories."

            });

        }

        const [result] = await db.query(
            `
            DELETE FROM categories
            WHERE category_id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,
                message: "Category not found"

            });

        }

        res.json({

            success: true,
            message: "Category Deleted Successfully"

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

    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory

};