const db = require("../config/db");

const addPlace = async (req, res) => {

    try {

        let {
            category_id,
            name,
            city,
            state,
            country,
            short_description,
            why_famous,
            best_time_to_visit,
            latitude,
            longitude
        } = req.body;

        if (
            !category_id ||
            !name ||
            !city ||
            !state ||
            !short_description
        ) {
            return res.status(400).json({
                success: false,
                message: "Category, Name, City, State and Description are required."
            });
        }

        name = name.trim();
        city = city.trim();
        state = state.trim();
        country = country?.trim() || "India";
        short_description = short_description.trim();

        // Category exists

        const [category] = await db.query(
            `SELECT category_id FROM categories WHERE category_id = ?`,
            [category_id]
        );

        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Duplicate Place

        const [existing] = await db.query(
            `
            SELECT place_id
            FROM places
            WHERE LOWER(name)=LOWER(?)
            `,
            [name]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Place already exists"
            });
        }

        // Latitude

        if (
            latitude !== null &&
            latitude !== undefined &&
            (latitude < -90 || latitude > 90)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid latitude"
            });

        }

        // Longitude

        if (
            longitude !== null &&
            longitude !== undefined &&
            (longitude < -180 || longitude > 180)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid longitude"
            });

        }

        const [result] = await db.query(
            `
            INSERT INTO places
            (
                category_id,
                name,
                city,
                state,
                country,
                short_description,
                why_famous,
                best_time_to_visit,
                latitude,
                longitude
            )

            VALUES
            (?,?,?,?,?,?,?,?,?,?)
            `,
            [
                category_id,
                name,
                city,
                state,
                country,
                short_description,
                why_famous || null,
                best_time_to_visit || null,
                latitude || null,
                longitude || null
            ]
        );

        const [place] = await db.query(
            `
            SELECT *
            FROM places
            WHERE place_id=?
            `,
            [result.insertId]
        );

        res.status(201).json({

            success: true,

            message: "Place Added Successfully",

            place: place[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const updatePlace = async (req, res) => {

    try {

        const id = req.params.id;

        let {

            category_id,
            name,
            city,
            state,
            country,
            short_description,
            why_famous,
            best_time_to_visit,
            latitude,
            longitude

        } = req.body;

        const [place] = await db.query(
            `
            SELECT *
            FROM places
            WHERE place_id=?
            `,
            [id]
        );

        if (place.length === 0) {

            return res.status(404).json({

                success:false,
                message:"Place not found"

            });

        }

        const [category] = await db.query(
            `
            SELECT category_id
            FROM categories
            WHERE category_id=?
            `,
            [category_id]
        );

        if(category.length===0){

            return res.status(404).json({

                success:false,
                message:"Category not found"

            });

        }

        const [duplicate] = await db.query(

            `
            SELECT place_id
            FROM places
            WHERE LOWER(name)=LOWER(?)
            AND place_id<>?
            `,
            [
                name,
                id
            ]

        );

        if(duplicate.length>0){

            return res.status(400).json({

                success:false,
                message:"Place already exists"

            });

        }

        if(latitude && (latitude<-90 || latitude>90)){

            return res.status(400).json({

                success:false,
                message:"Invalid latitude"

            });

        }

        if(longitude && (longitude<-180 || longitude>180)){

            return res.status(400).json({

                success:false,
                message:"Invalid longitude"

            });

        }

        await db.query(

            `
            UPDATE places

            SET

            category_id=?,
            name=?,
            city=?,
            state=?,
            country=?,
            short_description=?,
            why_famous=?,
            best_time_to_visit=?,
            latitude=?,
            longitude=?

            WHERE place_id=?

            `,

            [

                category_id,
                name.trim(),
                city.trim(),
                state.trim(),
                country || "India",
                short_description.trim(),
                why_famous,
                best_time_to_visit,
                latitude,
                longitude,
                id

            ]

        );

        const [updated] = await db.query(

            `
            SELECT *
            FROM places
            WHERE place_id=?
            `,
            [id]

        );

        res.json({

            success:true,

            message:"Place Updated Successfully",

            place:updated[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

const deletePlace = async (req, res) => {

    let connection;

    try {

        const id = req.params.id;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // Check Place Exists
        const [place] = await connection.query(
            `
            SELECT place_id
            FROM places
            WHERE place_id = ?
            `,
            [id]
        );

        if (place.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Place not found"
            });

        }

        // Delete Gallery
        await connection.query(
            `
            DELETE FROM gallery
            WHERE place_id = ?
            `,
            [id]
        );

        // Delete Reviews
        await connection.query(
            `
            DELETE FROM reviews
            WHERE place_id = ?
            `,
            [id]
        );

        // Delete Nearby Relations
        await connection.query(
            `
            DELETE FROM nearby_places
            WHERE place_id = ?
            OR nearby_place_id = ?
            `,
            [id, id]
        );

        // Delete Place Details
        await connection.query(
            `
            DELETE FROM place_detail
            WHERE place_id = ?
            `,
            [id]
        );

        // Delete Stories
        await connection.query(
            `
            DELETE FROM stories
            WHERE place_id = ?
            `,
            [id]
        );

        // Delete Saved Places
        await connection.query(
            `
            DELETE FROM saved_places
            WHERE place_id = ?
            `,
            [id]
        );

        // Delete Place
        await connection.query(
            `
            DELETE FROM places
            WHERE place_id = ?
            `,
            [id]
        );

        await connection.commit();

        res.status(200).json({

            success: true,
            message: "Place Deleted Successfully"

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
const createPlaceDetails = async (req, res) => {

    try {

        let {
            place_id,
            architecture,
            significance,
            rituals,
            visiting_hour,
            entry_fee
        } = req.body;

        if (!place_id) {

            return res.status(400).json({
                success: false,
                message: "Place ID is required"
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
                message: "Place not found"
            });

        }

        // Check Existing Details

        const [exists] = await db.query(
            `
            SELECT detail_id
            FROM place_detail
            WHERE place_id = ?
            `,
            [place_id]
        );

        if (exists.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Details already exist for this place"
            });

        }

        await db.query(
            `
            INSERT INTO place_detail
            (
                place_id,
                architecture,
                significance,
                rituals,
                visiting_hour,
                entry_fee
            )
            VALUES (?,?,?,?,?,?)
            `,
            [
                place_id,
                architecture?.trim() || null,
                significance?.trim() || null,
                rituals?.trim() || null,
                visiting_hour?.trim() || null,
                entry_fee?.trim() || null
            ]
        );

        const [details] = await db.query(
            `
            SELECT *
            FROM place_detail
            WHERE place_id = ?
            `,
            [place_id]
        );

        res.status(201).json({

            success: true,

            message: "Place Details Created Successfully",

            details: details[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
const updatePlaceDetails = async (req, res) => {

    try {

        const placeId = req.params.placeId;

        let {

            architecture,
            significance,
            rituals,
            visiting_hour,
            entry_fee

        } = req.body;

        // Check Place Exists

        const [place] = await db.query(
            `
            SELECT place_id
            FROM places
            WHERE place_id = ?
            `,
            [placeId]
        );

        if (place.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Place not found"

            });

        }

        // Check Details Exists

        const [exists] = await db.query(
            `
            SELECT detail_id
            FROM place_detail
            WHERE place_id = ?
            `,
            [placeId]
        );

        if (exists.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Place details not found"

            });

        }

        await db.query(
            `
            UPDATE place_detail

            SET

                architecture = ?,
                significance = ?,
                rituals = ?,
                visiting_hour = ?,
                entry_fee = ?

            WHERE place_id = ?
            `,
            [
                architecture?.trim() || null,
                significance?.trim() || null,
                rituals?.trim() || null,
                visiting_hour?.trim() || null,
                entry_fee?.trim() || null,
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

            message: "Place Details Updated Successfully",

            details: updated[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const deletePlaceDetails = async (req, res) => {

    try {

        const placeId = req.params.placeId;

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
                message: "Place details not found"

            });

        }

        await db.query(
            `
            DELETE
            FROM place_detail
            WHERE place_id = ?
            `,
            [placeId]
        );

        res.json({

            success: true,

            message: "Place Details Deleted Successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const createStory = async (req, res) => {

    try {

        let {
            place_id,
            category_id,
            title,
            summary,
            content,
            source_name,
            source_url
        } = req.body;

        if (!category_id || !title || !summary || !content) {

            return res.status(400).json({
                success: false,
                message: "Category, Title, Summary and Content are required."
            });

        }

        title = title.trim();
        summary = summary.trim();
        content = content.trim();
        source_name = source_name?.trim() || null;
        source_url = source_url?.trim() || null;

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
                message: "Category not found"
            });

        }

        // Place Exists (Optional)

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
                    message: "Place not found"
                });

            }

        }

        // Duplicate Title

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
                message: "Story title already exists"
            });

        }

        // URL Validation

        if (
            source_url &&
            !/^https?:\/\/.+/i.test(source_url)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid Source URL"
            });

        }

        const [result] = await db.query(
            `
            INSERT INTO stories
            (
                place_id,
                category_id,
                title,
                summary,
                content,
                source_name,
                source_url
            )
            VALUES(?,?,?,?,?,?,?)
            `,
            [
                place_id || null,
                category_id,
                title,
                summary,
                content,
                source_name,
                source_url
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

            message: "Story Created Successfully",

            story: story[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const updateStory = async (req, res) => {

    try {

        const id = req.params.id;

        let {

            place_id,
            category_id,
            title,
            summary,
            content,
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
                message: "Story not found"

            });

        }

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
                message: "Category not found"

            });

        }

        // Place Exists (Optional)

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
                    message: "Place not found"

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
                message: "Story title already exists"

            });

        }

        // URL Validation

        if (
            source_url &&
            !/^https?:\/\/.+/i.test(source_url)
        ) {

            return res.status(400).json({

                success: false,
                message: "Invalid Source URL"

            });

        }

        await db.query(
            `
            UPDATE stories

            SET

            place_id=?,
            category_id=?,
            title=?,
            summary=?,
            content=?,
            source_name=?,
            source_url=?

            WHERE story_id=?

            `,
            [
                place_id || null,
                category_id,
                title.trim(),
                summary.trim(),
                content.trim(),
                source_name?.trim() || null,
                source_url?.trim() || null,
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

            message: "Story Updated Successfully",

            story: updated[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const deleteStory = async (req, res) => {

    try {

        const id = req.params.id;

        const [story] = await db.query(
            `
            SELECT story_id
            FROM stories
            WHERE story_id=?
            `,
            [id]
        );

        if (story.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Story not found"

            });

        }

        await db.query(
            `
            DELETE
            FROM stories
            WHERE story_id=?
            `,
            [id]
        );

        res.json({

            success: true,

            message: "Story Deleted Successfully"

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
    addPlace,
    updatePlace,
    deletePlace,

    createStory,
    updateStory,
    deleteStory,

    createPlaceDetails,
    updatePlaceDetails,
    deletePlaceDetails,

};