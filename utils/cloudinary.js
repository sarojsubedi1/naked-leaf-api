require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloud = (file, options) =>
  new Promise((resolve, reject) =>
    cloudinary.uploader.upload(file, options, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    }),
  );

const deleteFromCloud = (publicId) =>
  new Promise((resolve, reject) =>
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    }),
  );

const deleteFolder = (folder) =>
  new Promise((resolve, reject) => {
    cloudinary.api.delete_folder(folder, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });

const deleteProductFromCloud = async (imageUrl, folderName) => {
  // Construct the publicId
  const pathAfterLastSlash = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  const fileNameWithoutExtension = pathAfterLastSlash.replace(/\.[^/.]+$/, "");
  const publicId = `products/${folderName}/${fileNameWithoutExtension}`;

  // Delete the image from cloud storage
  await deleteFromCloud(publicId);
  await deleteFolder(`products/${folderName}`);
};

module.exports = {
  uploadToCloud,
  deleteFromCloud,
  deleteProductFromCloud,
};
