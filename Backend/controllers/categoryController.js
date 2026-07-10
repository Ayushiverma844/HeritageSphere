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

    if (usage_type === "STORY") {
        query += " AND usage_type IN ('STORY','BOTH')";
        countQuery += " AND usage_type IN ('STORY','BOTH')";
    }

    else if (usage_type === "PLACE") {
        query += " AND usage_type IN ('PLACE','BOTH')";
        countQuery += " AND usage_type IN ('PLACE','BOTH')";
    }

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
        usage_type = usage_type.trim().toUpperCase();

        if (!category_name) {

            return res.status(400).json({

                success: false,
                message: "Category Name cannot be empty."

            });

        }

        if (!["PLACE", "STORY", "BOTH"].includes(usage_type)) {

            return res.status(400).json({

                success: false,
                message: "Invalid Usage Type."

            });

        }

        const [existing] = await db.query(

            `
            SELECT category_id
            FROM categories
            WHERE LOWER(category_name) = LOWER(?)
            `,
            [category_name]

        );

        if (existing.length > 0) {

            return res.status(409).json({

                success: false,
                message: "Category already exists."

            });

        }

        const [result] = await db.query(

            `
            INSERT INTO categories
            (
                category_name,
                usage_type
            )
            VALUES (?, ?)
            `,
            [
                category_name,
                usage_type
            ]

        );

        res.status(201).json({

            success: true,
            message: "Category created successfully.",
            categoryId: result.insertId

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
// Update Category
// ==========================
const updateCategory = async (req, res) => {

    try {

        const id = req.params.id;

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
        usage_type = usage_type.trim().toUpperCase();

        if (!category_name) {

            return res.status(400).json({

                success: false,
                message: "Category Name cannot be empty."

            });

        }

        if (!["PLACE", "STORY", "BOTH"].includes(usage_type)) {

            return res.status(400).json({

                success: false,
                message: "Invalid Usage Type."

            });

        }

        const [category] = await db.query(

            `
            SELECT category_id
            FROM categories
            WHERE category_id = ?
            `,
            [id]

        );

        if (category.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Category not found."

            });

        }

        const [duplicate] = await db.query(

            `
            SELECT category_id
            FROM categories
            WHERE LOWER(category_name)=LOWER(?)
            AND category_id<>?
            `,
            [
                category_name,
                id
            ]

        );

        if (duplicate.length > 0) {

            return res.status(409).json({

                success: false,
                message: "Category already exists."

            });

        }

        await db.query(

            `
            UPDATE categories
            SET

                category_name=?,
                usage_type=?

            WHERE category_id=?
            `,
            [

                category_name,
                usage_type,
                id

            ]

        );

        res.json({

            success: true,
            message: "Category updated successfully."

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
// Delete Category
// ==========================
const deleteCategory = async (req, res) => {

    try {

        const id = req.params.id;

        const [category] = await db.query(

            `
            SELECT category_id
            FROM categories
            WHERE category_id=?
            `,
            [id]

        );

        if (category.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Category not found."

            });

        }

        const [[placeUsage]] = await db.query(

            `
            SELECT COUNT(*) AS total
            FROM places
            WHERE category_id=?
            `,
            [id]

        );

        if (placeUsage.total > 0) {

            return res.status(400).json({

                success: false,
                message: "Category is currently used by one or more places."

            });

        }

        const [[storyUsage]] = await db.query(

            `
            SELECT COUNT(*) AS total
            FROM stories
            WHERE category_id=?
            `,
            [id]

        );

        if (storyUsage.total > 0) {

            return res.status(400).json({

                success: false,
                message: "Category is currently used by one or more stories."

            });

        }

        await db.query(

            `
            DELETE FROM categories
            WHERE category_id=?
            `,
            [id]

        );

        res.json({

            success: true,
            message: "Category deleted successfully."

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

module.exports = {

    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory

};