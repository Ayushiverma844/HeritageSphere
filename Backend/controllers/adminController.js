const db = require("../config/db");
const slugify = require("slugify");

// ==========================================
// Helper
// ==========================================

const generateSlug = (title) => {

    return slugify(title, {

        lower: true,
        strict: true,
        trim: true

    });

};

// ==========================================
// Create Place
// ==========================================

const createPlace = async (req, res) => {

    let connection;

    try {

        connection = await db.getConnection();

        await connection.beginTransaction();

        let {

            category_id,
            name,
            city,
            state,
            country,
            image_url,
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
            !short_description

        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Category, Name, City, State and Short Description are required."

            });

        }

        name = name.trim();
        city = city.trim();
        state = state.trim();

        country = country?.trim() || "India";

        short_description = short_description.trim();

        // ==========================
        // Category Exists
        // ==========================

        const [category] = await connection.query(

            `
            SELECT category_id

            FROM categories

            WHERE category_id=?
            `,

            [category_id]

        );

        if (category.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Category not found"

            });

        }

        // ==========================
        // Duplicate Place
        // ==========================

        const [duplicate] = await connection.query(

            `
            SELECT place_id

            FROM places

            WHERE LOWER(name)=LOWER(?)
            `,

            [name]

        );

        if (duplicate.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Place already exists"

            });

        }

        // ==========================
        // Latitude
        // ==========================

        if (

            latitude !== undefined &&
            latitude !== null &&
            (latitude < -90 || latitude > 90)

        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Invalid Latitude"

            });

        }

        // ==========================
        // Longitude
        // ==========================

        if (

            longitude !== undefined &&
            longitude !== null &&
            (longitude < -180 || longitude > 180)

        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Invalid Longitude"

            });

        }

        // ==========================
        // Insert Place
        // ==========================

        const [placeResult] = await connection.query(

            `
            INSERT INTO places
            (
                category_id,
                name,
                city,
                state,
                country,
                image_url,
                entry_fee,
                latitude,
                longitude
            )

            VALUES
            (?,?,?,?,?,?,?,?,?)
            `,

            [

                category_id,
                name,
                city,
                state,
                country,
                image_url || null,
                entry_fee || null,
                latitude || null,
                longitude || null

            ]

        );

        const placeId = placeResult.insertId;

        // ==========================
        // Insert Place Details
        // ==========================

        await connection.query(

            `
            INSERT INTO place_detail
            (

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

            VALUES
            (?,?,?,?,?,?,?,?,?,?,?,?,?)

            `,

            [

                placeId,

                short_description,

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

        // ==========================
        // Fetch Created Place
        // ==========================

        const [place] = await db.query(

            `
            SELECT

                p.*,

                c.category_name,

                pd.*

            FROM places p

            JOIN categories c
                ON p.category_id=c.category_id

            LEFT JOIN place_detail pd
                ON p.place_id=pd.place_id

            WHERE p.place_id=?

            `,

            [placeId]

        );

        res.status(201).json({

            success: true,

            message: "Place Created Successfully.",

            place: place[0]

        });

    } catch (error) {

        if (connection) {

            await connection.rollback();

        }

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    } finally {

        if (connection) {

            connection.release();

        }

    }

};

// ==========================================
// Update Place
// ==========================================

const updatePlace = async (req, res) => {

    let connection;

    try {

        const { placeId } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================
        // Check Place Exists
        // ==========================

        const [place] = await connection.query(

            `
            SELECT *
            FROM places
            WHERE place_id = ?
            `,
            [placeId]

        );

        if (place.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,
                message: "Place not found."

            });

        }

        let {

            category_id,
            name,
            city,
            state,
            country,
            image_url,
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
        // Category Exists
        // ==========================

        const [category] = await connection.query(

            `
            SELECT category_id
            FROM categories
            WHERE category_id = ?
            `,
            [category_id]

        );

        if (category.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,
                message: "Category not found."

            });

        }

        // ==========================
        // Duplicate Name
        // ==========================

        const [duplicate] = await connection.query(

            `
            SELECT place_id
            FROM places
            WHERE LOWER(name)=LOWER(?)
            AND place_id<>?
            `,
            [name, placeId]

        );

        if (duplicate.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,
                message: "Place name already exists."

            });

        }

        // ==========================
        // Update Place
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
                entry_fee=?,
                latitude=?,
                longitude=?

            WHERE place_id=?
            `,

            [

                category_id,
                name,
                city,
                state,
                country || "India",
                image_url || null,
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

        const [updated] = await db.query(

            `
            SELECT

                p.*,
                c.category_name,
                pd.*

            FROM places p

            JOIN categories c
            ON p.category_id = c.category_id

            LEFT JOIN place_detail pd
            ON p.place_id = pd.place_id

            WHERE p.place_id = ?
            `,

            [placeId]

        );

        res.status(200).json({

            success: true,
            message: "Place updated successfully.",
            place: updated[0]

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

    finally {

        if (connection) {

            connection.release();

        }

    }

};

// ==========================================
// Delete Place
// ==========================================

const deletePlace = async (req, res) => {

    let connection;

    try {

        const { placeId } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================
        // Check Exists
        // ==========================

        const [place] = await connection.query(

            `
            SELECT place_id
            FROM places
            WHERE place_id = ?
            `,
            [placeId]

        );

        if (place.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,
                message: "Place not found."

            });

        }

        // ==========================
        // Delete Place Details
        // ==========================

        await connection.query(

            `
            DELETE FROM place_detail
            WHERE place_id = ?
            `,

            [placeId]

        );

        // ==========================
        // Delete Stories of Place
        // ==========================

        await connection.query(

            `
            DELETE FROM stories
            WHERE place_id = ?
            `,

            [placeId]

        );

        // ==========================
        // Delete Saved Items
        // ==========================

        await connection.query(

            `
            DELETE FROM saved_items
            WHERE item_type='PLACE'
            AND item_id=?
            `,

            [placeId]

        );

        // ==========================
        // Delete Place
        // ==========================

        await connection.query(

            `
            DELETE FROM places
            WHERE place_id = ?
            `,

            [placeId]

        );

        await connection.commit();

        res.status(200).json({

            success: true,
            message: "Place deleted successfully."

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

    finally {

        if (connection) {

            connection.release();

        }

    }

};

// ==========================================
// Create Place Details
// ==========================================

const createPlaceDetails = async (req, res) => {

    try {

        const { place_id } = req.body;

        if (!place_id) {

            return res.status(400).json({
                success: false,
                message: "Place ID is required."
            });

        }

        // Check Place Exists

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
                message: "Place not found."
            });

        }

        // Details Already Exists

        const [existing] = await db.query(
            `
            SELECT detail_id
            FROM place_detail
            WHERE place_id = ?
            `,
            [place_id]
        );

        if (existing.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Place details already exist."
            });

        }

        const {

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

        const [result] = await db.query(

            `
            INSERT INTO place_detail
            (

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

            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)

            `,
            [

                place_id,

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

                photography_allowed || null

            ]

        );

        const [details] = await db.query(

            `
            SELECT *
            FROM place_detail
            WHERE detail_id = ?
            `,
            [result.insertId]

        );

        res.status(201).json({

            success: true,

            message: "Place details created successfully.",

            details: details[0]

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

// ==========================================
// Update Place Details
// ==========================================

const updatePlaceDetails = async (req, res) => {

    try {

        const { placeId } = req.params;

        const [details] = await db.query(

            `
            SELECT *
            FROM place_detail
            WHERE place_id = ?
            `,
            [placeId]

        );

        if (details.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Place details not found."

            });

        }

        const {

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

        await db.query(

            `
            UPDATE place_detail

            SET

                short_description = ?,

                why_famous = ?,

                history = ?,

                architecture = ?,

                significance = ?,

                best_time_to_visit = ?,

                visiting_hours = ?,

                rituals = ?,

                how_to_reach = ?,

                travel_tips = ?,

                dress_code = ?,

                photography_allowed = ?

            WHERE place_id = ?

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

                photography_allowed || null,

                placeId

            ]

        );

        const [updated] = await db.query(

            `
            SELECT *
            FROM place_detail
            WHERE place_id = ?
            `,
            [placeId]

        );

        res.json({

            success: true,

            message: "Place details updated successfully.",

            details: updated[0]

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

// ==========================================
// Delete Place Details
// ==========================================

const deletePlaceDetails = async (req, res) => {

    try {

        const { placeId } = req.params;

        const [details] = await db.query(

            `
            SELECT detail_id
            FROM place_detail
            WHERE place_id = ?
            `,
            [placeId]

        );

        if (details.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Place details not found."

            });

        }

        await db.query(

            `
            DELETE FROM place_detail
            WHERE place_id = ?
            `,
            [placeId]

        );

        res.json({

            success: true,

            message: "Place details deleted successfully."

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
// ==========================================
// Create Story
// ==========================================

const createStory = async (req, res) => {

    try {

        let {

            place_id,
            category_id,
            title,
            summary,
            cover_image,
            source_name,
            source_url

        } = req.body;

        // ==========================
        // Validation
        // ==========================

        if (

            !category_id ||
            !title ||
            !summary

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Category, Title and Summary are required."

            });

        }

        title = title.trim();
        summary = summary.trim();

        const slug = generateSlug(title);

        // ==========================
        // Category Exists
        // ==========================

        const [category] = await db.query(

            `
            SELECT category_id
            FROM categories
            WHERE category_id=?
            `,
            [category_id]

        );

        if (category.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Category not found."

            });

        }

        // ==========================
        // Place Exists (Optional)
        // ==========================

        if (place_id) {

            const [place] = await db.query(

                `
                SELECT place_id
                FROM places
                WHERE place_id=?
                `,
                [place_id]

            );

            if (place.length === 0) {

                return res.status(404).json({

                    success: false,

                    message: "Place not found."

                });

            }

        }

        // ==========================
        // Duplicate Title
        // ==========================

        const [duplicate] = await db.query(

            `
            SELECT story_id
            FROM stories
            WHERE LOWER(title)=LOWER(?)
            `,
            [title]

        );

        if (duplicate.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Story already exists."

            });

        }

        // ==========================
        // Slug Exists
        // ==========================

        const [slugExists] = await db.query(

            `
            SELECT story_id
            FROM stories
            WHERE slug=?
            `,
            [slug]

        );

        if (slugExists.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Slug already exists."

            });

        }

        // ==========================
        // URL Validation
        // ==========================

        if (

            source_url &&
            !/^https?:\/\/.+/i.test(source_url)

        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid source URL."

            });

        }

        // ==========================
        // Insert Story
        // ==========================

        const [result] = await db.query(

            `
            INSERT INTO stories
            (

                place_id,

                category_id,

                title,

                slug,

                summary,

                cover_image,

                total_chapters,

                source_name,

                source_url

            )

            VALUES
            (?,?,?,?,?,?,?,?,?)

            `,

            [

                place_id || null,

                category_id,

                title,

                slug,

                summary,

                cover_image || null,

                0,

                source_name || null,

                source_url || null

            ]

        );

        const [story] = await db.query(

            `
            SELECT *

            FROM stories

            WHERE story_id=?

            `,

            [result.insertId]

        );

        res.status(201).json({

            success: true,

            message: "Story created successfully.",

            story: story[0]

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

// ==========================================
// Update Story
// ==========================================

const updateStory = async (req, res) => {

    try {

        const id = req.params.id;

        let {

            place_id,
            category_id,
            title,
            summary,
            cover_image,
            source_name,
            source_url

        } = req.body;

        const [story] = await db.query(

            `
            SELECT *
            FROM stories
            WHERE story_id=?
            `,
            [id]

        );

        if (story.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Story not found."

            });

        }

        title = title.trim();
        summary = summary.trim();

        const slug = generateSlug(title);

        // Category Exists

        const [category] = await db.query(

            `
            SELECT category_id
            FROM categories
            WHERE category_id=?
            `,
            [category_id]

        );

        if (category.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Category not found."

            });

        }

        // Place Exists

        if (place_id) {

            const [place] = await db.query(

                `
                SELECT place_id
                FROM places
                WHERE place_id=?
                `,
                [place_id]

            );

            if (place.length === 0) {

                return res.status(404).json({

                    success: false,

                    message: "Place not found."

                });

            }

        }

        // Duplicate Title

        const [duplicate] = await db.query(

            `
            SELECT story_id
            FROM stories
            WHERE LOWER(title)=LOWER(?)
            AND story_id<>?
            `,
            [

                title,

                id

            ]

        );

        if (duplicate.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Story title already exists."

            });

        }

        // Duplicate Slug

        const [slugExists] = await db.query(

            `
            SELECT story_id
            FROM stories
            WHERE slug=?
            AND story_id<>?
            `,
            [

                slug,

                id

            ]

        );

        if (slugExists.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Slug already exists."

            });

        }

        await db.query(

            `
            UPDATE stories

            SET

                place_id=?,

                category_id=?,

                title=?,

                slug=?,

                summary=?,

                cover_image=?,

                source_name=?,

                source_url=?

            WHERE story_id=?

            `,

            [

                place_id || null,

                category_id,

                title,

                slug,

                summary,

                cover_image || null,

                source_name || null,

                source_url || null,

                id

            ]

        );

        const [updated] = await db.query(

            `
            SELECT *
            FROM stories
            WHERE story_id=?
            `,
            [id]

        );

        res.json({

            success: true,

            message: "Story updated successfully.",

            story: updated[0]

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
// ==========================================
// Delete Story
// ==========================================

const deleteStory = async (req, res) => {

    let connection;

    try {

        const id = req.params.id;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // Story Exists

        const [story] = await connection.query(

            `
            SELECT story_id
            FROM stories
            WHERE story_id=?
            `,

            [id]

        );

        if (story.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Story not found."

            });

        }

        // Delete Chapters

        await connection.query(

            `
            DELETE FROM story_chapters
            WHERE story_id=?
            `,

            [id]

        );

        // Delete Saved Story

        await connection.query(

            `
            DELETE FROM saved_items

            WHERE item_type='STORY'

            AND item_id=?
            `,

            [id]

        );

        // Delete Story

        await connection.query(

            `
            DELETE FROM stories
            WHERE story_id=?
            `,

            [id]

        );

        await connection.commit();

        res.json({

            success: true,

            message: "Story deleted successfully."

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

    finally {

        if (connection) {

            connection.release();

        }

    }

};

// ==========================================
// Create Chapter
// ==========================================

const createChapter = async (req, res) => {

    try {

        let {

            story_id,

            chapter_number,

            title,

            content,

            image_url,

            quote

        } = req.body;

        if (

            !story_id ||

            !chapter_number ||

            !title ||

            !content

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Story, Chapter Number, Title and Content are required."

            });

        }

        // Story Exists

        const [story] = await db.query(

            `
            SELECT story_id
            FROM stories
            WHERE story_id=?
            `,

            [story_id]

        );

        if (story.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Story not found."

            });

        }

        // Duplicate Chapter Number

        const [duplicate] = await db.query(

            `
            SELECT chapter_id

            FROM story_chapters

            WHERE story_id=?

            AND chapter_number=?

            `,

            [

                story_id,

                chapter_number

            ]

        );

        if (duplicate.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Chapter number already exists."

            });

        }

        const [result] = await db.query(

            `
            INSERT INTO story_chapters
            (

                story_id,

                chapter_number,

                title,

                content,

                image_url,

                quote

            )

            VALUES
            (?,?,?,?,?,?)

            `,

            [

                story_id,

                chapter_number,

                title.trim(),

                content.trim(),

                image_url || null,

                quote || null

            ]

        );

        // Update Total Chapters

        await db.query(

            `
            UPDATE stories

            SET total_chapters=(

                SELECT COUNT(*)

                FROM story_chapters

                WHERE story_id=?

            )

            WHERE story_id=?

            `,

            [

                story_id,

                story_id

            ]

        );

        const [chapter] = await db.query(

            `
            SELECT *

            FROM story_chapters

            WHERE chapter_id=?

            `,

            [result.insertId]

        );

        res.status(201).json({

            success: true,

            message: "Chapter created successfully.",

            chapter: chapter[0]

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

// ==========================================
// Update Chapter
// ==========================================

const updateChapter = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            chapter_number,

            title,

            content,

            image_url,

            quote

        } = req.body;

        const [chapter] = await db.query(

            `
            SELECT *

            FROM story_chapters

            WHERE chapter_id=?

            `,

            [id]

        );

        if (chapter.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Chapter not found."

            });

        }

        const storyId = chapter[0].story_id;

        // Duplicate Number

        const [duplicate] = await db.query(

            `
            SELECT chapter_id

            FROM story_chapters

            WHERE story_id=?

            AND chapter_number=?

            AND chapter_id<>?

            `,

            [

                storyId,

                chapter_number,

                id

            ]

        );

        if (duplicate.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Chapter number already exists."

            });

        }

        await db.query(

            `
            UPDATE story_chapters

            SET

                chapter_number=?,

                title=?,

                content=?,

                image_url=?,

                quote=?

            WHERE chapter_id=?

            `,

            [

                chapter_number,

                title,

                content,

                image_url || null,

                quote || null,

                id

            ]

        );

        const [updated] = await db.query(

            `
            SELECT *

            FROM story_chapters

            WHERE chapter_id=?

            `,

            [id]

        );

        res.json({

            success: true,

            message: "Chapter updated successfully.",

            chapter: updated[0]

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

// ==========================================
// Delete Chapter
// ==========================================

const deleteChapter = async (req, res) => {

    try {

        const id = req.params.id;

        const [chapter] = await db.query(

            `
            SELECT *

            FROM story_chapters

            WHERE chapter_id=?

            `,

            [id]

        );

        if (chapter.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Chapter not found."

            });

        }

        const storyId = chapter[0].story_id;

        await db.query(

            `
            DELETE FROM story_chapters

            WHERE chapter_id=?

            `,

            [id]

        );

        // Update total chapters

        await db.query(

            `
            UPDATE stories

            SET total_chapters=(

                SELECT COUNT(*)

                FROM story_chapters

                WHERE story_id=?

            )

            WHERE story_id=?

            `,

            [

                storyId,

                storyId

            ]

        );

        res.json({

            success: true,

            message: "Chapter deleted successfully."

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

    // ==========================
    // Places
    // ==========================

    createPlace,
    updatePlace,
    deletePlace,

    // ==========================
    // Place Details
    // ==========================

    createPlaceDetails,
    updatePlaceDetails,
    deletePlaceDetails,

    // ==========================
    // Stories
    // ==========================

    createStory,
    updateStory,
    deleteStory,

    // ==========================
    // Story Chapters
    // ==========================

    createChapter,
    updateChapter,
    deleteChapter

};