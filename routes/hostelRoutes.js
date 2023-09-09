import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Hostel from '../models/hostelModal.js';

const hostelRoutes = express.Router();

hostelRoutes.post('/getHostels', async (req, res) => {
  const hostels = await Hostel.find({
    userId: req.body.userId,
  });
  res.status(200).send({
    success: true,
    message: 'Succesfully get hostels',
    data: hostels,
  });
});

hostelRoutes.post(
  '/addHostel',
  expressAsyncHandler(async (req, res) => {
    const newHostel = new Hostel({
      userId: req.body.userId,
      hostelName: req.body.hostelName,
      noOfseatAvai: req.body.noOfseatAvai,
      seatAvailible: req.body.seatAvailible,
      totalSeats: req.body.totalSeats,
    });
    const hostel = await newHostel.save();
    res.status(201).send({
      success: true,
      message: 'Hostel added succesfully.',
      data: hostel,
    });
  })
);

hostelRoutes.delete(
  '/deleteHostel',
  expressAsyncHandler(async (req, res) => {
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
  })
);

export default hostelRoutes;
