const db = require("../config/db");

// ==========================================
// Add Image
// ==========================================
const addImage = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            place_id,
            image_url,
            caption,
            is_cover
        } = req.body;

        if (!place_id || !image_url) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "place_id and image_url are required"
            });

        }

        // Check place exists
        const [place] = await connection.query(
            `
            SELECT place_id
            FROM places
            WHERE place_id = ?
            `,
            [place_id]
        );

        if (place.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Place not found"
            });

        }

        // Reset old cover
        if (is_cover) {

            await connection.query(
                `
                UPDATE gallery
                SET is_cover = 0
                WHERE place_id = ?
                `,
                [place_id]
            );

        }

        const [result] = await connection.query(
            `
            INSERT INTO gallery
            (
                place_id,
                image_url,
                caption,
                is_cover
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                place_id,
                image_url.trim(),
                caption?.trim() || null,
                is_cover ? 1 : 0
            ]
        );

        await connection.commit();

        res.status(201).json({

            success: true,

            message: "Image added successfully",

            imageId: result.insertId

        });

    } catch (error) {

        await connection.rollback();

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    } finally {

        connection.release();

    }

};

// ==========================================
// Get Images By Place
// ==========================================
const getImagesByPlace = async (req, res) => {

    try {

        const placeId = req.params.placeId;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const [[count]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM gallery
            WHERE place_id = ?
            `,
            [placeId]
        );

        const [images] = await db.query(
            `
            SELECT
                image_id,
                image_url,
                caption,
                is_cover
            FROM gallery
            WHERE place_id = ?
            ORDER BY
                is_cover DESC,
                image_id ASC
            LIMIT ?
            OFFSET ?
            `,
            [
                placeId,
                limit,
                offset
            ]
        );

        res.json({

            success: true,

            pagination: {

                totalRecords: count.total,

                currentPage: page,

                totalPages: Math.ceil(count.total / limit),

                limit

            },

            images

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
// Delete Image
// ==========================================
const deleteImage = async (req, res) => {

    try {

        const imageId = req.params.imageId;

        const [image] = await db.query(
            `
            SELECT image_id
            FROM gallery
            WHERE image_id = ?
            `,
            [imageId]
        );

        if (image.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Image not found"

            });

        }

        await db.query(
            `
            DELETE
            FROM gallery
            WHERE image_id = ?
            `,
            [imageId]
        );

        res.json({

            success: true,

            message: "Image deleted successfully"

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
// Set Cover Image
// ==========================================
const setCoverImage = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const imageId = req.params.imageId;

        const [image] = await connection.query(
            `
            SELECT
                image_id,
                place_id
            FROM gallery
            WHERE image_id = ?
            `,
            [imageId]
        );

        if (image.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Image not found"

            });

        }

        const placeId = image[0].place_id;

        await connection.query(
            `
            UPDATE gallery
            SET is_cover = 0
            WHERE place_id = ?
            `,
            [placeId]
        );

        await connection.query(
            `
            UPDATE gallery
            SET is_cover = 1
            WHERE image_id = ?
            `,
            [imageId]
        );

        await connection.commit();

        res.json({

            success: true,

            message: "Cover image updated successfully"

        });

    } catch (error) {

        await connection.rollback();

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    } finally {

        connection.release();

    }

};

module.exports = {

    addImage,

    getImagesByPlace,

    deleteImage,

    setCoverImage

};