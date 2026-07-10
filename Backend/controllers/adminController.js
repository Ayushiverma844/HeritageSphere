const db = require("../config/db");
const slugify = require("slugify");

const {
    uploadImage,
    deleteImage
} = require("../utils/cloudinaryHelper");

// ==========================================
// Helper Functions
// ==========================================

const generateSlug = (title) => {

    return slugify(title, {

        lower: true,
        strict: true,
        trim: true

    });

};
// ==========================================
// Generate Unique Story Slug
// ==========================================

const generateUniqueSlug = async (connection, title) => {

    const baseSlug = slugify(title, {

        lower: true,
        strict: true,
        trim: true

    });

    let slug = baseSlug;

    let count = 1;

    while (true) {

        const [existing] = await connection.query(

            `
            SELECT story_id

            FROM stories

            WHERE slug=?
            `,

            [slug]

        );

        if (existing.length === 0) {

            return slug;

        }

        slug = `${baseSlug}-${count}`;

        count++;

    }

};

const isEmpty = (value) => {

    return (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    );

};

const validateLatitude = (latitude) => {

    if (
        latitude === undefined ||
        latitude === null ||
        latitude === ""
    ) {
        return true;
    }

    return latitude >= -90 && latitude <= 90;

};

const validateLongitude = (longitude) => {

    if (
        longitude === undefined ||
        longitude === null ||
        longitude === ""
    ) {
        return true;
    }

    return longitude >= -180 && longitude <= 180;

};




// ==========================================
// Create Place
// ==========================================

const createPlace = async (req, res) => {

    let connection;

    let uploadedImage = null;

    try {

        connection = await db.getConnection();

        await connection.beginTransaction();

        let {

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
        // Required Validation
        // ==========================

        if (

            isEmpty(category_id) ||

            isEmpty(name) ||

            isEmpty(city) ||

            isEmpty(state) ||

            isEmpty(short_description)

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
        // Latitude
        // ==========================

        if (!validateLatitude(latitude)) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Invalid Latitude"

            });

        }

        // ==========================
        // Longitude
        // ==========================

        if (!validateLongitude(longitude)) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Invalid Longitude"

            });

        }

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

                message: "Category not found."

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

                message: "Place already exists."

            });

        }

        // ==========================
        // Upload Image (Optional)
        // ==========================

        let image_url = null;

        let public_id = null;

        if (req.file) {

            uploadedImage = await uploadImage(

                req.file.buffer,

                "places"

            );

            image_url = uploadedImage.secure_url;

            public_id = uploadedImage.public_id;

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

                public_id,

                entry_fee,

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

                image_url,

                public_id,

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
        // Fetch Created Record
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

        return res.status(201).json({

            success: true,

            message: "Place created successfully.",

            place: place[0]

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        // Delete uploaded image if DB failed

        if (uploadedImage?.public_id) {

            await deleteImage(uploadedImage.public_id);

        }

        console.log(error);

        return res.status(500).json({

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
// Update Place
// ==========================================

const updatePlace = async (req, res) => {

    let connection;

    let uploadedImage = null;

    try {

        const { placeId } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================
        // Existing Place
        // ==========================

        const [existingPlace] = await connection.query(
            `
            SELECT *
            FROM places
            WHERE place_id=?
            `,
            [placeId]
        );

        if (existingPlace.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Place not found."
            });

        }

        const oldPlace = existingPlace[0];

        let {

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
        // Required Validation
        // ==========================

        if (

            isEmpty(category_id) ||
            isEmpty(name) ||
            isEmpty(city) ||
            isEmpty(state) ||
            isEmpty(short_description)

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
        // Latitude
        // ==========================

        if (!validateLatitude(latitude)) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Invalid Latitude"

            });

        }

        // ==========================
        // Longitude
        // ==========================

        if (!validateLongitude(longitude)) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Invalid Longitude"

            });

        }

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

            [

                name,

                placeId

            ]

        );

        if (duplicate.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Place name already exists."

            });

        }

        // ==========================
        // Image Handling
        // ==========================

        let image_url = oldPlace.image_url;

        let public_id = oldPlace.public_id;

        if (req.file) {

            uploadedImage = await uploadImage(

                req.file.buffer,

                "places"

            );

            image_url = uploadedImage.secure_url;

            public_id = uploadedImage.public_id;

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

                public_id=?,

                entry_fee=?,

                latitude=?,

                longitude=?,

                updated_at=CURRENT_TIMESTAMP

            WHERE place_id=?

            `,

            [

                category_id,

                name,

                city,

                state,

                country,

                image_url,

                public_id,

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

                photography_allowed || "Yes",

                placeId

            ]

        );

        await connection.commit();

        // ==========================
        // Delete Old Cloudinary Image
        // ==========================

        if (

            req.file &&

            oldPlace.public_id &&

            oldPlace.public_id !== public_id

        ) {

            await deleteImage(oldPlace.public_id);

        }

        // ==========================
        // Return Updated Place
        // ==========================

        const [updated] = await db.query(

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

        return res.status(200).json({

            success: true,

            message: "Place updated successfully.",

            place: updated[0]

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        // Delete newly uploaded image if DB update failed

        if (uploadedImage?.public_id) {

            await deleteImage(uploadedImage.public_id);

        }

        console.log(error);

        return res.status(500).json({

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

        // ==========================================
        // Check Place Exists
        // ==========================================

        const [place] = await connection.query(

            `
            SELECT
                place_id,
                public_id
            FROM places
            WHERE place_id=?
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

        const oldPublicId = place[0].public_id;

        // ==========================================
        // Check Stories
        // ==========================================

        const [stories] = await connection.query(

            `
            SELECT story_id
            FROM stories
            WHERE place_id=?
            `,

            [placeId]

        );

        if (stories.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Cannot delete place. Delete all stories related to this place first."

            });

        }

        // ==========================================
        // Delete Saved Items
        // ==========================================

        await connection.query(

            `
            DELETE FROM saved_items

            WHERE item_type='PLACE'

            AND item_id=?
            `,

            [placeId]

        );

        // ==========================================
        // Delete Place Detail
        // ==========================================

        await connection.query(

            `
            DELETE FROM place_detail

            WHERE place_id=?
            `,

            [placeId]

        );

        // ==========================================
        // Delete Gallery Images
        // ==========================================

        const [galleryImages] = await connection.query(

            `
            SELECT public_id

            FROM gallery

            WHERE place_id=?
            `,

            [placeId]

        );

        await connection.query(

            `
            DELETE FROM gallery

            WHERE place_id=?
            `,

            [placeId]

        );

        // ==========================================
        // Delete Place
        // ==========================================

        await connection.query(

            `
            DELETE FROM places

            WHERE place_id=?
            `,

            [placeId]

        );

        await connection.commit();

        // ==========================================
        // Delete Cloudinary Images
        // ==========================================

        try {

            if (oldPublicId) {

                await deleteImage(oldPublicId);

            }

            for (const image of galleryImages) {

                if (image.public_id) {

                    await deleteImage(image.public_id);

                }

            }

        }

        catch (cloudinaryError) {

            console.log(
                "Cloudinary Delete Error:",
                cloudinaryError.message
            );

        }

        return res.status(200).json({

            success: true,

            message: "Place deleted successfully."

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        console.log(error);

        return res.status(500).json({

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

        // Already Exists

        const [existing] = await db.query(

            `
            SELECT detail_id

            FROM place_detail

            WHERE place_id=?

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

            VALUES
            (?,?,?,?,?,?,?,?,?,?,?,?,?)

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

                photography_allowed || "Yes"

            ]

        );

        const [details] = await db.query(

            `
            SELECT *

            FROM place_detail

            WHERE detail_id=?

            `,

            [result.insertId]

        );

        return res.status(201).json({

            success: true,

            message: "Place details created successfully.",

            details: details[0]

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

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

            WHERE place_id=?

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

        const [updated] = await db.query(

            `
            SELECT *

            FROM place_detail

            WHERE place_id=?

            `,

            [placeId]

        );

        return res.json({

            success: true,

            message: "Place details updated successfully.",

            details: updated[0]

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

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

            WHERE place_id=?

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

            WHERE place_id=?

            `,

            [placeId]

        );

        return res.json({

            success: true,

            message: "Place details deleted successfully."

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================================
// Create Story
// ==========================================

const createStory = async (req, res) => {

    let connection;

    let uploadedImage = null;

    try {

        connection = await db.getConnection();

        await connection.beginTransaction();

        let {

            place_id,

            category_id,

            title,

            summary,

            

            source_name,

            source_url

        } = req.body;

        // ==========================
        // Validation
        // ==========================

        if (

            isEmpty(place_id) ||

            isEmpty(category_id) ||

            isEmpty(title) ||

            isEmpty(summary)

        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Place, Category, Title and Summary are required."

            });

        }

        title = title.trim();

        summary = summary.trim();

        // ==========================
        // Check Place
        // ==========================

        const [place] = await connection.query(

            `
            SELECT place_id

            FROM places

            WHERE place_id=?
            `,

            [place_id]

        );

        if (place.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Place not found."

            });

        }

        // ==========================
        // Check Category
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

                message: "Category not found."

            });

        }

        // ==========================
        // Generate Slug
        // ==========================

        const slug = await generateUniqueSlug(

            connection,

            title

        );

        // ==========================
        // Upload Cover Image
        // ==========================

        let cover_image = null;

        let public_id = null;

        if (req.file) {

            uploadedImage = await uploadImage(

                req.file.buffer,

                "stories"

            );

            cover_image = uploadedImage.secure_url;

            public_id = uploadedImage.public_id;

        }

        // ==========================
        // Insert Story
        // ==========================

        const [result] = await connection.query(

            `
            INSERT INTO stories
            (

                place_id,

                category_id,

                title,

                slug,

                summary,

                cover_image,

                public_id,

                total_chapters,

                source_name,

                source_url

            )

            VALUES
            (?,?,?,?,?,?,?,?,?,?)

            `,

            [

                place_id,

                category_id,

                title,

                slug,

                summary,

                cover_image,

                public_id,

                 0,

                source_name || null,

                source_url || null

            ]

        );

        await connection.commit();

        // ==========================
        // Fetch Story
        // ==========================

        const [story] = await db.query(

            `
            SELECT

                s.*,

                p.name AS place_name,

                c.category_name

            FROM stories s

            JOIN places p

            ON s.place_id=p.place_id

            JOIN categories c

            ON s.category_id=c.category_id

            WHERE s.story_id=?

            `,

            [

                result.insertId

            ]

        );

        return res.status(201).json({

            success: true,

            message: "Story created successfully.",

            story: story[0]

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        // Remove uploaded image if DB failed

        if (uploadedImage?.public_id) {

            await deleteImage(

                uploadedImage.public_id

            );

        }

        console.log(error);

        return res.status(500).json({

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
// Update Story
// ==========================================

const updateStory = async (req, res) => {

    let connection;
    let uploadedImage = null;

    try {

        const { storyId } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================================
        // Existing Story
        // ==========================================

        const [story] = await connection.query(

            `
            SELECT *
            FROM stories
            WHERE story_id=?
            `,

            [storyId]

        );

        if (story.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,
                message: "Story not found."

            });

        }

        const oldStory = story[0];

        let {

            place_id,
            category_id,
            title,
            summary,
            source_name,
            source_url

        } = req.body;

        // ==========================================
        // Validation
        // ==========================================

        if (

            isEmpty(place_id) ||
            isEmpty(category_id) ||
            isEmpty(title) ||
            isEmpty(summary)

        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,
                message:
                    "Place, Category, Title and Summary are required."

            });

        }

        title = title.trim();
        summary = summary.trim();

        // ==========================================
        // Check Place
        // ==========================================

        const [place] = await connection.query(

            `
            SELECT place_id
            FROM places
            WHERE place_id=?
            `,

            [place_id]

        );

        if (place.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,
                message: "Place not found."

            });

        }

        // ==========================================
        // Check Category
        // ==========================================

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
                message: "Category not found."

            });

        }

        // ==========================================
        // Generate Slug
        // ==========================================

        let slug = oldStory.slug;

        if (title !== oldStory.title) {

            const baseSlug = slugify(title, {

                lower: true,
                strict: true,
                trim: true

            });

            slug = baseSlug;

            let count = 1;

            while (true) {

                const [existing] = await connection.query(

                    `
                    SELECT story_id
                    FROM stories
                    WHERE slug=?
                    AND story_id<>?
                    `,

                    [

                        slug,
                        storyId

                    ]

                );

                if (existing.length === 0) {

                    break;

                }

                slug = `${baseSlug}-${count}`;

                count++;

            }

        }

        // ==========================================
        // Cover Image
        // ==========================================

        let cover_image = oldStory.cover_image;

        let public_id = oldStory.public_id;

        if (req.file) {

            uploadedImage = await uploadImage(

                req.file.buffer,
                "stories"

            );

            cover_image = uploadedImage.secure_url;

            public_id = uploadedImage.public_id;

        }

        // ==========================================
        // Update Story
        // ==========================================

        await connection.query(

            `
            UPDATE stories

            SET

                place_id=?,

                category_id=?,

                title=?,

                slug=?,

                summary=?,

                cover_image=?,

                public_id=?,

                source_name=?,

                source_url=?,

                updated_at=CURRENT_TIMESTAMP

            WHERE story_id=?

            `,

            [

                place_id,
                category_id,
                title,
                slug,
                summary,
                cover_image,
                public_id,
                source_name || null,
                source_url || null,
                storyId

            ]

        );

        await connection.commit();

        // ==========================================
        // Delete Old Cover
        // ==========================================

        if (

            req.file &&
            oldStory.public_id &&
            oldStory.public_id !== public_id

        ) {

            await deleteImage(

                oldStory.public_id

            );

        }

        // ==========================================
        // Return Updated Story
        // ==========================================

        const [updated] = await db.query(

            `
            SELECT

                s.*,

                p.name AS place_name,

                c.category_name

            FROM stories s

            JOIN places p

            ON s.place_id=p.place_id

            JOIN categories c

            ON s.category_id=c.category_id

            WHERE s.story_id=?

            `,

            [storyId]

        );

        return res.status(200).json({

            success: true,

            message: "Story updated successfully.",

            story: updated[0]

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        if (uploadedImage?.public_id) {

            await deleteImage(

                uploadedImage.public_id

            );

        }

        console.log(error);

        return res.status(500).json({

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
// Delete Story
// ==========================================

const deleteStory = async (req, res) => {

    let connection;

    try {

        const { storyId } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================================
        // Story Exists
        // ==========================================

        const [story] = await connection.query(

            `
            SELECT
                story_id,
                public_id
            FROM stories
            WHERE story_id=?
            `,

            [storyId]

        );

        if (story.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Story not found."

            });

        }

        const storyPublicId = story[0].public_id;

        // ==========================================
        // Fetch Chapter Images
        // ==========================================

        const [chapters] = await connection.query(

            `
            SELECT public_id

            FROM story_chapters

            WHERE story_id=?
            `,

            [storyId]

        );

        // ==========================================
        // Delete Saved Items
        // ==========================================

        await connection.query(

            `
            DELETE FROM saved_items

            WHERE item_type='STORY'

            AND item_id=?
            `,

            [storyId]

        );

        // ==========================================
        // Delete Chapters
        // ==========================================

        await connection.query(

            `
            DELETE FROM story_chapters

            WHERE story_id=?
            `,

            [storyId]

        );

        // ==========================================
        // Delete Story
        // ==========================================

        await connection.query(

            `
            DELETE FROM stories

            WHERE story_id=?
            `,

            [storyId]

        );

        await connection.commit();

        // ==========================================
        // Delete Cloudinary Images
        // ==========================================

        try {

            if (storyPublicId) {

                await deleteImage(

                    storyPublicId

                );

            }

            for (const chapter of chapters) {

                if (chapter.public_id) {

                    await deleteImage(

                        chapter.public_id

                    );

                }

            }

        }

        catch (cloudinaryError) {

            console.log(

                "Cloudinary Delete Error:",

                cloudinaryError.message

            );

        }

        return res.status(200).json({

            success: true,

            message: "Story deleted successfully."

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        console.log(error);

        return res.status(500).json({

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
// Create Story Chapter
// ==========================================

const createChapter = async (req, res) => {

    let connection;
    let uploadedImage = null;

    try {

        connection = await db.getConnection();

        await connection.beginTransaction();

        const { storyId } = req.params;

        let {

            chapter_number,
            title,
            content,
            quote

        } = req.body;

        // ==========================================
        // Validation
        // ==========================================

        if (

            isEmpty(chapter_number) ||
            isEmpty(title) ||
            isEmpty(content)

        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Chapter Number, Title and Content are required."

            });

        }

        chapter_number = Number(chapter_number);

        title = title.trim();

        content = content.trim();

        quote = quote?.trim() || null;

        // ==========================================
        // Story Exists
        // ==========================================

        const [story] = await connection.query(

            `
            SELECT story_id
            FROM stories
            WHERE story_id=?
            `,

            [storyId]

        );

        if (story.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Story not found."

            });

        }

        // ==========================================
        // Duplicate Chapter Number
        // ==========================================

        const [duplicate] = await connection.query(

            `
            SELECT chapter_id

            FROM story_chapters

            WHERE story_id=?

            AND chapter_number=?

            `,

            [

                storyId,

                chapter_number

            ]

        );

        if (duplicate.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Chapter number already exists."

            });

        }

        // ==========================================
        // Upload Chapter Image
        // ==========================================

        let image_url = null;

        let public_id = null;

        if (req.file) {

            uploadedImage = await uploadImage(

                req.file.buffer,

                "chapters"

            );

            image_url = uploadedImage.secure_url;

            public_id = uploadedImage.public_id;

        }

        // ==========================================
        // Insert Chapter
        // ==========================================

        const [chapterResult] = await connection.query(

            `
            INSERT INTO story_chapters
            (

                story_id,

                chapter_number,

                title,

                content,

                image_url,

                public_id,

                quote

            )

            VALUES
            (?,?,?,?,?,?,?)

            `,

            [

                storyId,

                chapter_number,

                title,

                content,

                image_url,

                public_id,

                quote

            ]

        );
                // ==========================================
        // Update Story Chapter Count
        // ==========================================

        await connection.query(

            `
            UPDATE stories

            SET

                total_chapters = total_chapters + 1,

                updated_at = CURRENT_TIMESTAMP

            WHERE story_id=?

            `,

            [storyId]

        );

        await connection.commit();

        // ==========================================
        // Fetch Created Chapter
        // ==========================================

        const [chapter] = await db.query(

            `
            SELECT

                sc.*,

                s.title AS story_title

            FROM story_chapters sc

            JOIN stories s

            ON sc.story_id = s.story_id

            WHERE sc.chapter_id = ?

            `,

            [chapterResult.insertId]

        );

        return res.status(201).json({

            success: true,

            message: "Chapter created successfully.",

            chapter: chapter[0]

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        // ==========================================
        // Delete Uploaded Image
        // if DB transaction failed
        // ==========================================

        if (uploadedImage?.public_id) {

            try {

                await deleteImage(uploadedImage.public_id);

            }

            catch (cloudinaryError) {

                console.log(

                    "Cloudinary Cleanup Error:",

                    cloudinaryError.message

                );

            }

        }

        console.log(error);

        return res.status(500).json({

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
// Update Chapter
// ==========================================

const updateChapter = async (req, res) => {

    let connection;
    let uploadedImage = null;

    try {

        const { chapterId } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================================
        // Existing Chapter
        // ==========================================

        const [chapter] = await connection.query(

            `
            SELECT *
            FROM story_chapters
            WHERE chapter_id=?
            `,

            [chapterId]

        );

        if (chapter.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Chapter not found."

            });

        }

        const oldChapter = chapter[0];

        let {

            chapter_number,
            title,
            content,
            quote

        } = req.body;

        // ==========================================
        // Validation
        // ==========================================

        if (

            isEmpty(chapter_number) ||
            isEmpty(title) ||
            isEmpty(content)

        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Chapter Number, Title and Content are required."

            });

        }

        chapter_number = Number(chapter_number);

        title = title.trim();

        content = content.trim();

        quote = quote?.trim() || null;

        // ==========================================
        // Duplicate Chapter Number
        // ==========================================

        const [duplicate] = await connection.query(

            `
            SELECT chapter_id

            FROM story_chapters

            WHERE story_id=?

            AND chapter_number=?

            AND chapter_id<>?

            `,

            [

                oldChapter.story_id,

                chapter_number,

                chapterId

            ]

        );

        if (duplicate.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Chapter number already exists."

            });

        }

        // ==========================================
        // Image Handling
        // ==========================================

        let image_url = oldChapter.image_url;

        let public_id = oldChapter.public_id;

        if (req.file) {

            uploadedImage = await uploadImage(

                req.file.buffer,

                "chapters"

            );

            image_url = uploadedImage.secure_url;

            public_id = uploadedImage.public_id;

        }

        // ==========================================
        // Update Chapter
        // ==========================================

        await connection.query(

            `
            UPDATE story_chapters

            SET

                chapter_number=?,

                title=?,

                content=?,

                image_url=?,

                public_id=?,

                quote=?,

                updated_at=CURRENT_TIMESTAMP

            WHERE chapter_id=?

            `,

            [

                chapter_number,

                title,

                content,

                image_url,

                public_id,

                quote,

                chapterId

            ]

        );
                await connection.commit();

        // ==========================================
        // Delete Old Cloudinary Image
        // ==========================================

        if (

            req.file &&

            oldChapter.public_id &&

            oldChapter.public_id !== public_id

        ) {

            try {

                await deleteImage(

                    oldChapter.public_id

                );

            }

            catch (cloudinaryError) {

                console.log(

                    "Cloudinary Delete Error:",

                    cloudinaryError.message

                );

            }

        }

        // ==========================================
        // Fetch Updated Chapter
        // ==========================================

        const [updated] = await db.query(

            `
            SELECT

                sc.*,

                s.title AS story_title

            FROM story_chapters sc

            JOIN stories s

            ON sc.story_id = s.story_id

            WHERE sc.chapter_id = ?

            `,

            [chapterId]

        );

        return res.status(200).json({

            success: true,

            message: "Chapter updated successfully.",

            chapter: updated[0]

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        // ==========================================
        // Delete Newly Uploaded Image
        // if DB update failed
        // ==========================================

        if (uploadedImage?.public_id) {

            try {

                await deleteImage(

                    uploadedImage.public_id

                );

            }

            catch (cloudinaryError) {

                console.log(

                    "Cloudinary Cleanup Error:",

                    cloudinaryError.message

                );

            }

        }

        console.log(error);

        return res.status(500).json({

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
// Delete Chapter
// ==========================================

const deleteChapter = async (req, res) => {

    let connection;

    try {

        const { chapterId } = req.params;

        connection = await db.getConnection();

        await connection.beginTransaction();

        // ==========================================
        // Check Chapter Exists
        // ==========================================

        const [chapter] = await connection.query(

            `
            SELECT

                chapter_id,

                story_id,

                public_id

            FROM story_chapters

            WHERE chapter_id=?

            `,

            [chapterId]

        );

        if (chapter.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Chapter not found."

            });

        }

        const storyId = chapter[0].story_id;

        const oldPublicId = chapter[0].public_id;

        // ==========================================
        // Delete Chapter
        // ==========================================

        await connection.query(

            `
            DELETE FROM story_chapters

            WHERE chapter_id=?

            `,

            [chapterId]

        );

        // ==========================================
        // Update Story Chapter Count
        // ==========================================

        await connection.query(

            `
            UPDATE stories

            SET

                total_chapters = CASE
                    WHEN total_chapters > 0
                    THEN total_chapters - 1
                    ELSE 0
                END,

                updated_at = CURRENT_TIMESTAMP

            WHERE story_id=?

            `,

            [storyId]

        );

        await connection.commit();

        // ==========================================
        // Delete Cloudinary Image
        // ==========================================

        if (oldPublicId) {

            try {

                await deleteImage(oldPublicId);

            }

            catch (cloudinaryError) {

                console.log(

                    "Cloudinary Delete Error:",

                    cloudinaryError.message

                );

            }

        }

        return res.status(200).json({

            success: true,

            message: "Chapter deleted successfully."

        });

    }

    catch (error) {

        if (connection) {

            await connection.rollback();

        }

        console.log(error);

        return res.status(500).json({

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

module.exports = {




    // ==========================================
    // Places
    // ==========================================

    createPlace,

    updatePlace,

    deletePlace,

    // ==========================================
    // Place Details
    // ==========================================

    createPlaceDetails,

    updatePlaceDetails,

    deletePlaceDetails,

    // ==========================================
    // Stories
    // ==========================================

    createStory,

    updateStory,

    deleteStory,

    // ==========================================
    // Chapters
    // ==========================================

    createChapter,

    updateChapter,

    deleteChapter

};