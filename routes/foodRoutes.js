import express from 'express';
import Food from '../models/foodModal.js';
import { authenticateJwt } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cron from 'node-cron';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images',
  allowedFormats: ['jpg', 'png'],
  // transformation: [{ width: 500, height: 500, crop: 'limit' }],
});

const upload = multer({ storage: storage });

const foodRoutes = express.Router();

foodRoutes.post(
  '/addFood',
  authenticateJwt,
  upload.single('foodImg'),
  async (req, res) => {
    try {
      const newFood = new Food({
        userId: req.body.userId,
        foodTitle: req.body.foodTitle,
        foodName: req.body.foodName,
        foodImg: req.file.path,
        imgPublicId: req.file.filename,
      });

      const savedFood = await newFood.save();

      res.status(201).json({
        success: true,
        message: 'Food Created Successfully.',
        data: savedFood,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// Function to delete images from Cloudinary
const deleteImagesFromCloudinary = async (imgPublicIds) => {
  try {
    await Promise.all(
      imgPublicIds.map(async (publicId) => {
        await cloudinary.uploader.destroy(publicId);
      })
    );
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
  }
};

// Scheduled task to check for expired documents and delete images
cron.schedule('0 0 * * *', async () => {
  try {
    const expirationDuration = 17 * 60 * 60 * 1000;
    const expiredDocuments = await Food.find({
      createdAt: { $lt: new Date(Date.now() - expirationDuration) },
    });

    if (expiredDocuments.length > 0) {
      const imgPublicIds = expiredDocuments.map((item) => item.imgPublicId);
      await deleteImagesFromCloudinary(imgPublicIds);
      // Delete expired documents from MongoDB
      await Food.deleteMany({
        _id: { $in: expiredDocuments.map((doc) => doc._id) },
      });
    } else {
      console.log('No expired documents found.');
    }
  } catch (error) {
    console.error('Error processing scheduled task:', error);
  }
});

//Keep the process running
process.stdin.resume();

export default foodRoutes;
