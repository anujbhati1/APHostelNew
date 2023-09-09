import express from 'express';
import Hostel from '../models/hostelModal.js';
import { authenticateJwt } from '../middleware/auth.js';

const hostelRoutes = express.Router();

hostelRoutes.post('/getHostels', authenticateJwt, async (req, res) => {
  try {
    const hostels = await Hostel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: 'Succesfully get hostels',
      data: hostels,
    });
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

hostelRoutes.post('/addHostel', authenticateJwt, async (req, res) => {
  try {
    const newHostel = new Hostel({
      userId: req.body.userId,
      hostelName: req.body.hostelName,
      hostelAddress: req.body.hostelAddress,
    });
    const hostel = await newHostel.save();
    res.status(201).send({
      success: true,
      message: 'Hostel added succesfully.',
      data: hostel,
    });
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

hostelRoutes.delete('/deleteHostel', authenticateJwt, async (req, res) => {
  try {
    const find = await Hostel.findById(req.body.hostelId);
    if (find) {
      await Hostel.deleteOne({ _id: req.body.hostelId });
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
