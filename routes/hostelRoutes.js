import express from 'express';
import Hostel from '../models/hostelModal.js';
import { authenticateJwt } from '../middleware/auth.js';
import Admin from '../models/adminModal.js';
import Floor from '../models/floorModal.js';
import Room from '../models/roomModal.js';
import Bed from '../models/bedModal.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images',
  allowedFormats: ['jpg', 'png'],
  // transformation: [{ width: 500, height: 500, crop: 'limit' }],
});

const upload = multer({ storage: storage });

const hostelRoutes = express.Router();

hostelRoutes.post('/getHostels', authenticateJwt, async (req, res) => {
  try {
    const findAdmin = await Admin.findOne({ _id: req.body.userId });
    if (findAdmin) {
      const hostels = await Hostel.find({
        userId: req.body.userId,
      });
      res.status(200).send({
        success: true,
        message: 'Succesfully get hostels',
        data: hostels,
      });
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

hostelRoutes.post(
  '/addHostel',
  authenticateJwt,
  upload.single('hostelImage'),
  async (req, res) => {
    try {
      const findAdmin = await Admin.findOne({
        _id: req.body.userId,
      });
      if (findAdmin) {
        const newHostel = new Hostel({
          userId: req.body.userId,
          hostelName: req.body.hostelName,
          hostelAddress: req.body.hostelAddress,
          hostelMapLink: req.body.hostelMapLink,
          hostelLat: req.body.hostelLat,
          hostelLng: req.body.hostelLng,
        });
        // Check if a file was uploaded
        if (req.file) {
          newHostel.hostelImage = req.file.path;
          newHostel.imgPublicId = req.file.filename;
        }

        const hostel = await newHostel.save();
        res.status(201).send({
          success: true,
          message: 'Hostel added succesfully.',
          data: hostel,
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: 'Invalid Credentials' });
      }
    } catch (e) {
      res.status(404).json({ success: false, message: e.message });
    }
  }
);

hostelRoutes.delete('/deleteHostel', authenticateJwt, async (req, res) => {
  try {
    const find = await Hostel.findById(req.body.hostelId);
    if (find) {
      await cloudinary.uploader.destroy(find.imgPublicId);
      await Hostel.deleteOne({ _id: req.body.hostelId });
      await Floor.deleteOne({
        hostelId: req.body.hostelId,
      });
      await Room.deleteOne({
        hostelId: req.body.hostelId,
      });
      await Bed.deleteMany({
        hostelId: req.body.hostelId,
      });
      res.send({
        success: true,
        message: 'Hostel deleted successfully',
      });
    } else {
      res.status(404).send({ success: false, message: 'Hostel not found' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default hostelRoutes;
