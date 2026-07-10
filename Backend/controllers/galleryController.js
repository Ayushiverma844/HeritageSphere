const db = require("../config/db");

const {
  uploadImage,
  deleteImage,
} = require("../utils/cloudinaryHelper");

// ==========================================
// Upload Gallery Images
// POST /admin/gallery/:placeId
// ==========================================

const uploadGalleryImages = async (req, res) => {
  let connection;

  const uploadedImages = [];

  try {
    const placeId = req.params.placeId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select gallery images.",
      });
    }

    // Check Place Exists

    const [place] = await db.query(
      `
      SELECT place_id
      FROM places
      WHERE place_id=?
      `,
      [placeId]
    );

    if (place.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    // Upload every image

    for (const file of req.files) {

      const image = await uploadImage(
        file.buffer,
        "gallery"
      );

      uploadedImages.push(image);

      await connection.query(
        `
        INSERT INTO gallery
        (
          place_id,
          image_url,
          public_id,
          caption,
          is_cover
        )
        VALUES
        (
          ?,?,?,?,?
        )
        `,
        [
          placeId,
          image.secure_url,
          image.public_id,
          "",
          0,
        ]
      );
    }

    await connection.commit();

    connection.release();

    res.status(201).json({
      success: true,
      message: "Gallery uploaded successfully.",
    });

  } catch (error) {

    console.log(error);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    // Delete uploaded cloudinary images

    for (const image of uploadedImages) {
      await deleteImage(image.public_id);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get Gallery
// GET /gallery/:placeId
// ==========================================

const getGalleryImages = async (req, res) => {

  try {

    const placeId = req.params.placeId;

    const [images] = await db.query(
      `
      SELECT
        image_id,
        image_url,
        caption,
        is_cover
      FROM gallery
      WHERE place_id=?
      ORDER BY image_id ASC
      `,
      [placeId]
    );

    res.json({
      success: true,
      gallery: images,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ==========================================
// Update Caption
// PUT /admin/gallery/:imageId
// ==========================================

const updateGalleryCaption = async (req, res) => {

  try {

    const imageId = req.params.imageId;

    const { caption } = req.body;

    const [result] = await db.query(
      `
      UPDATE gallery
      SET caption=?
      WHERE image_id=?
      `,
      [
        caption || "",
        imageId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    res.json({
      success: true,
      message: "Caption updated successfully.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ==========================================
// Delete Gallery Image
// DELETE /admin/gallery/:imageId
// ==========================================

const deleteGalleryImage = async (req, res) => {

  let connection;

  try {

    const imageId = req.params.imageId;

    const [image] = await db.query(
      `
      SELECT
        public_id
      FROM gallery
      WHERE image_id=?
      `,
      [imageId]
    );

    if (image.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    await connection.query(
      `
      DELETE FROM gallery
      WHERE image_id=?
      `,
      [imageId]
    );

    await connection.commit();

    connection.release();

    if (image[0].public_id) {
      await deleteImage(image[0].public_id);
    }

    res.json({
      success: true,
      message: "Gallery image deleted successfully.",
    });

  } catch (error) {

    console.log(error);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



module.exports = {

  uploadGalleryImages,

  getGalleryImages,

  updateGalleryCaption,

  deleteGalleryImage,


};