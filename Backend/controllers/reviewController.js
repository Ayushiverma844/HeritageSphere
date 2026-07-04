const db = require("../config/db");

// ==========================================
// Add Review
// ==========================================
const addReview = async (req, res) => {

    try {

        const userId = req.user.id;

        let {
            place_id,
            rating,
            comment
        } = req.body;

        rating = Number(rating);

        // Required validation
        if (!place_id || rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "Place and Rating are required"
            });
        }

        // Rating validation
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check place exists
        const [place] = await db.query(
            `
            SELECT place_id
            FROM places
            WHERE place_id = ?
            `,
            [place_id]
        );

        if (place.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }

        // Prevent duplicate review
        const [existing] = await db.query(
            `
            SELECT review_id
            FROM reviews
            WHERE user_id = ?
            AND place_id = ?
            `,
            [userId, place_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this place"
            });
        }

        // Insert review
        const [result] = await db.query(
            `
            INSERT INTO reviews
            (user_id, place_id, rating, comment)
            VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                place_id,
                rating,
                comment?.trim() || null
            ]
        );

        // Fetch inserted review
        const [review] = await db.query(
            `
            SELECT
                r.review_id,
                r.rating,
                r.comment,
                r.created_at,
                u.user_id,
                u.name
            FROM reviews r
            JOIN users u
            ON r.user_id = u.user_id
            WHERE r.review_id = ?
            `,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: review[0]
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
// Update Review
// ==========================================
const updateReview = async (req, res) => {

    try {

        const reviewId = req.params.id;
        const userId = req.user.id;

        let {
            rating,
            comment
        } = req.body;

        rating = Number(rating);

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check ownership
        const [review] = await db.query(
            `
            SELECT review_id
            FROM reviews
            WHERE review_id = ?
            AND user_id = ?
            `,
            [reviewId, userId]
        );

        if (review.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Update review
        await db.query(
            `
            UPDATE reviews
            SET
                rating = ?,
                comment = ?
            WHERE review_id = ?
            `,
            [
                rating,
                comment?.trim() || null,
                reviewId
            ]
        );

        // Return updated review
        const [updated] = await db.query(
            `
            SELECT
                review_id,
                rating,
                comment,
                updated_at
            FROM reviews
            WHERE review_id = ?
            `,
            [reviewId]
        );

        res.json({
            success: true,
            message: "Review updated successfully",
            review: updated[0]
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
// Delete Review
// ==========================================
const deleteReview = async (req, res) => {

    try {

        const reviewId = req.params.id;
        const userId = req.user.id;

        // Check ownership
        const [review] = await db.query(
            `
            SELECT review_id
            FROM reviews
            WHERE review_id = ?
            AND user_id = ?
            `,
            [reviewId, userId]
        );

        if (review.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Delete review
        await db.query(
            `
            DELETE FROM reviews
            WHERE review_id = ?
            `,
            [reviewId]
        );

        res.json({
            success: true,
            message: "Review deleted successfully"
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
    addReview,
    updateReview,
    deleteReview
};