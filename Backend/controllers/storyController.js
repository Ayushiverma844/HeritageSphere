const db = require("../config/db");
const slugify = require("../utils/slugify");

const {
  uploadImage,
  deleteImage,
} = require("../utils/cloudinaryHelper");


// Admin


const getAdminStories = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 30,
    } = req.query;

    // ==========================
    // Pagination
    // ==========================

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 30;
    }

    const offset = (page - 1) * limit;

    // ==========================
    // Total Count
    // ==========================

    const [countResult] = await db.query(`
      SELECT COUNT(*) AS totalStories
      FROM stories
    `);

    const totalStories = countResult[0].totalStories;
    const totalPages = Math.max(
      1,
      Math.ceil(totalStories / limit)
    );

    // ==========================
    // Stories
    // ==========================

    const [stories] = await db.query(
      `
      SELECT
        s.story_id,
        s.title,
        s.cover_image,
        s.total_chapters,
        s.created_at,
        s.summary,
        c.category_name,
        p.name AS place_name

      FROM stories s

      JOIN categories c
        ON s.category_id = c.category_id

      LEFT JOIN places p
        ON s.place_id = p.place_id

      ORDER BY s.created_at DESC

      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return res.json({
      success: true,

      pagination: {
        currentPage: page,
        totalPages,
        totalStories,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      stories,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminStoryById = async (req,res)=>{

try{

const storyId=req.params.id;

const [story]=await db.query(

`
SELECT

story_id,
place_id,
category_id,
title,
summary,
cover_image,
public_id,
source_name,
source_url

FROM stories

WHERE story_id=?
`,

[storyId]

);

if(story.length===0){

return res.status(404).json({

success:false,

message:"Story not found."

});

}

const [chapters]=await db.query(

`
SELECT
  chapter_id,
  story_id,
  chapter_number,
  title,
  content,
  image_url,
  public_id,
  quote
FROM story_chapters
WHERE story_id=?
ORDER BY chapter_number
`,

[storyId]

);

res.json({

success:true,

story:story[0],

chapters

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};


// ==========================================
// Create Story
// POST /admin/stories
// ==========================================

const createStory = async (req, res) => {
  let connection = null;
  let coverImage = null;

  try {
    const {
      place_id,
      category_id,
      title,
      summary,
      source_name,
      source_url,
      chapters,
    } = req.body;

    // ==========================
    // Validation
    // ==========================

    if (!category_id || !title || !chapters) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    let parsedChapters;

    try {
      parsedChapters = JSON.parse(chapters);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid chapters format.",
      });
    }

    if (!Array.isArray(parsedChapters) || parsedChapters.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one chapter is required.",
      });
    }

    // ==========================
    // Upload Cover Image
    // ==========================

   const coverFile = req.files?.cover_image?.[0];

if (coverFile) {
  coverImage = await uploadImage(
    coverFile.buffer,
    "stories"
  );
}

    // ==========================
    // Generate Slug
    // ==========================

    let slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const [slugExists] = await db.query(
      `
      SELECT story_id
      FROM stories
      WHERE slug=?
      `,
      [slug]
    );

    if (slugExists.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // ==========================
    // Transaction
    // ==========================

    connection = await db.getConnection();

    await connection.beginTransaction();

    // ==========================
    // Insert Story
    // ==========================

    const [storyResult] = await connection.query(
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
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        place_id || null,
        category_id,
        title,
        slug,
        summary || "",
        coverImage ? coverImage.secure_url : null,
        coverImage ? coverImage.public_id : null,
        parsedChapters.length,
        source_name || "",
        source_url || "",
      ]
    );

    const storyId = storyResult.insertId;

    // ==========================
    // Insert Chapters
    // ==========================

    for (let i = 0; i < parsedChapters.length; i++) {
      const chapter = parsedChapters[i];

      await connection.query(
        `
        INSERT INTO story_chapters
        (
          story_id,
          chapter_number,
          title,
          content,
          quote
        )
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
          storyId,
          i + 1,
          chapter.title || "",
          chapter.content || "",
          chapter.quote || "",
        ]
      );
    }

    // ==========================
    // Commit
    // ==========================

    await connection.commit();

    connection.release();
    connection = null;

    return res.status(201).json({
      success: true,
      message: "Story created successfully.",
      storyId,
    });

  } catch (error) {
    console.log(error);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    if (coverImage?.public_id) {
      await deleteImage(coverImage.public_id);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// Update Story
// PUT /admin/stories/:id
// ==========================================

const updateStory = async (req, res) => {

  let connection = null;

  let newCover = null;

  try {

    const storyId = req.params.id;

    const {

      place_id,

      category_id,

      title,

      summary,

      source_name,

      source_url,

      chapters

    } = req.body;

    // ==========================
    // Validation
    // ==========================

    if (

      !category_id ||

      !title ||

      !chapters

    ) {

      return res.status(400).json({

        success: false,

        message: "Required fields are missing."

      });

    }

    let parsedChapters;

    try {

      parsedChapters = JSON.parse(chapters);

    }

    catch {

      return res.status(400).json({

        success: false,

        message: "Invalid chapters format."

      });

    }

    if (

      !Array.isArray(parsedChapters) ||

      parsedChapters.length === 0

    ) {

      return res.status(400).json({

        success: false,

        message: "At least one chapter is required."

      });

    }

    // ==========================
    // Existing Story
    // ==========================

    const [story] = await db.query(

      `
      SELECT

        cover_image,

        public_id,

        slug

      FROM stories

      WHERE story_id=?
      `,

      [storyId]

    );

    if (story.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Story not found."

      });

    }

    // ==========================
    // Upload New Cover
    // ==========================

const coverFile = req.files?.cover_image?.[0];

if (coverFile) {
  newCover = await uploadImage(
    coverFile.buffer,
    "stories"
  );
}

    // ==========================
    // Slug
    // ==========================

    let slug = slugify(title, {

      lower: true,

      strict: true

    });

    const [slugExists] = await db.query(

      `
      SELECT story_id

      FROM stories

      WHERE slug=?

      AND story_id!=?
      `,

      [

        slug,

        storyId

      ]

    );

    if (slugExists.length > 0) {

      slug = `${slug}-${Date.now()}`;

    }

    // ==========================
    // Transaction
    // ==========================

    connection = await db.getConnection();

    await connection.beginTransaction();

    // ==========================
    // Update Story
    // ==========================

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

        total_chapters=?,

        source_name=?,

        source_url=?

      WHERE story_id=?
      `,

      [

        place_id || null,

        category_id,

        title,

        slug,

        summary || "",

        newCover

          ? newCover.secure_url

          : story[0].cover_image,

        newCover

          ? newCover.public_id

          : story[0].public_id,

        parsedChapters.length,

        source_name || "",

        source_url || "",

        storyId

      ]

    );

    // ==========================
    // Remove Old Chapters
    // ==========================

    await connection.query(

      `
      DELETE

      FROM story_chapters

      WHERE story_id=?
      `,

      [storyId]

    );

    // ==========================
    // Insert New Chapters
    // ==========================

    for (

      let i = 0;

      i < parsedChapters.length;

      i++

    ) {

      const chapter = parsedChapters[i];

      await connection.query(

        `
        INSERT INTO story_chapters
        (

          story_id,

          chapter_number,

          title,

          content,

          quote

        )

        VALUES

        (

          ?,?,?,?,?

        )
        `,

        [

          storyId,

          i + 1,

          chapter.title || "",

          chapter.content || "",

          chapter.quote || ""

        ]

      );

    }

    // ==========================
    // Commit
    // ==========================

    await connection.commit();

    connection.release();

    connection = null;

    // ==========================
    // Delete Old Cover
    // ==========================

    if (

      newCover &&

      story[0].public_id

    ) {

      await deleteImage(

        story[0].public_id

      );

    }

    return res.json({

      success: true,

      message: "Story updated successfully."

    });

  }

  catch (error) {

    console.log(error);

    if (connection) {

      await connection.rollback();

      connection.release();

    }

    if (

      newCover?.public_id

    ) {

      await deleteImage(

        newCover.public_id

      );

    }

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Delete Story
// DELETE /admin/stories/:id
// ==========================================

const deleteStory = async (req, res) => {

  let connection;

  try {

    const storyId = req.params.id;

    // ==========================
    // Check Story
    // ==========================

    const [story] = await db.query(

      `
      SELECT

        public_id

      FROM stories

      WHERE story_id=?

      `,
      [storyId]

    );

    if (story.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Story not found."

      });

    }

    connection =
      await db.getConnection();

    await connection.beginTransaction();

    // ==========================
    // Delete Chapters
    // (Skip if FK CASCADE)
    // ==========================

    await connection.query(

      `
      DELETE
      FROM story_chapters
      WHERE story_id=?
      `,

      [storyId]

    );

    // ==========================
    // Delete Story
    // ==========================

    await connection.query(

      `
      DELETE
      FROM stories
      WHERE story_id=?
      `,

      [storyId]

    );

    await connection.commit();

    connection.release();
    connection = null;

    // ==========================
    // Delete Cover Image
    // ==========================

    if (story[0].public_id) {

      await deleteImage(

        story[0].public_id

      );

    }

    res.json({

      success: true,

      message:
        "Story deleted successfully."

    });

  }

  catch (error) {

    console.log(error);

    if (connection) {

      await connection.rollback();

      connection.release();

    }

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};






// Public

// ==========================
// Get All Stories
// ==========================
const getAllStories = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      category,
      search,
      sort = "newest",
    } = req.query;

  page = Number(page);
limit = Number(limit);

if (isNaN(page) || page < 1) {
  page = 1;
}

if (isNaN(limit) || limit < 1) {
  limit = 30;
}

    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM stories s
      JOIN categories c
        ON s.category_id = c.category_id
      LEFT JOIN places p
        ON s.place_id = p.place_id
      WHERE 1=1
    `;

    const values = [];

    // ======================
    // Filters
    // ======================

    if (category) {
      baseQuery += ` AND c.category_name = ? `;
      values.push(category);
    }

    if (search) {
      baseQuery += `
        AND (
          s.title LIKE ?
          OR s.summary LIKE ?
          OR c.category_name LIKE ?
          OR p.name LIKE ?
          OR s.source_name LIKE ?
        )
      `;

      values.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    // ======================
    // Count
    // ======================

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total ${baseQuery}`,
      values
    );

    const totalStories = countResult[0].total;

    // ======================
    // Sorting
    // ======================

    let orderBy = "ORDER BY s.created_at DESC";

    if (sort === "oldest") {
      orderBy = "ORDER BY s.created_at ASC";
    }

    if (sort === "title") {
      orderBy = "ORDER BY s.title ASC";
    }

    // ======================
    // Stories
    // ======================

    const [stories] = await db.query(
      `
      SELECT
        s.story_id,
        s.place_id,
        s.slug,
        s.title,
        s.summary,
        s.cover_image,
        s.total_chapters,
        s.source_name,
        s.source_url,
        s.created_at,
        s.source_name,

        c.category_id,
        c.category_name,

        p.name AS place_name

      ${baseQuery}

      ${orderBy}

      LIMIT ? OFFSET ?
      `,
      [...values, limit, offset]
    );

    res.status(200).json({
      success: true,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalStories / limit),
        totalStories,
        limit,
        hasNextPage: page < Math.ceil(totalStories / limit),
        hasPreviousPage: page > 1,
      },

      stories,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// Get Story Details
// ==========================
const getStoryDetails = async (req, res) => {

  try {

    const { slug } = req.params;

    // ======================
    // Story
    // ======================

    const [story] = await db.query(
      `
      SELECT
        s.story_id,
        s.place_id,
        s.slug,
        s.title,
        s.summary,
        s.cover_image,
        s.total_chapters,
        s.source_name,
        s.source_url,
        s.created_at,
        s.updated_at,

        c.category_id,
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

      WHERE s.slug = ?
      `,
      [slug]
    );

    if (story.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // ======================
    // Chapters
    // ======================

    const [chapters] = await db.query(
      `
      SELECT
  chapter_id,
  story_id,
  chapter_number,
  title,
  content,
  image_url,
  public_id,
  quote
FROM story_chapters
WHERE story_id = ?
ORDER BY chapter_number ASC
      `,
      [story[0].story_id]
    );

    // ======================
    // Response
    // ======================

    res.status(200).json({
      success: true,
      story: story[0],
      chapters,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getAllStories,
  getStoryDetails,

  getAdminStories,
  getAdminStoryById,

  createStory,
  updateStory,
  deleteStory
 
};