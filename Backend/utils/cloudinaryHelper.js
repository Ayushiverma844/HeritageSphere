const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/*
Folders

places
stories
chapters
gallery
profiles
*/

const uploadImage = (buffer, folder) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {

                folder: `HeritageSphere/${folder}`,

                resource_type: "image",

                overwrite: true,

                unique_filename: true,

                transformation: [

                    {
                        fetch_format: "auto"
                    },

                    {
                        quality: "auto"
                    }

                ]

            },

            (error, result) => {

                if (error) {

                    reject(error);

                } else {

                    resolve(result);

                }

            }

        );

        streamifier.createReadStream(buffer).pipe(stream);

    });

};

const deleteImage = async (publicId) => {

    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);

};

module.exports = {

    uploadImage,

    deleteImage

};