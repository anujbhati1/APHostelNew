import express from 'express';
import Bed from '../models/bedModal.js';
import { authenticateJwt } from '../middleware/auth.js';

const bedRoutes = express.Router();

bedRoutes.post('/getBeds', authenticateJwt, async (req, res) => {
  try {
    const beds = await Bed.find({
      hostelId: req.body.hostelId,
      floorId: req.body.floorId,
      roomId: req.body.roomId,
    });
    res.status(200).send({
      success: true,
      message: 'Succesfully get beds',
      data: beds,
    });
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

bedRoutes.post('/addBed', authenticateJwt, async (req, res) => {
  try {
    const newBed = new Bed({
      userId: req.body.userId,
      hostelId: req.body.hostelId,
      floorId: req.body.floorId,
      roomId: req.body.roomId,
      bedName: req.body.bedName,
      amont: req.body.amont,
      seatAvailible: req.body.seatAvailible,
    });
    const bed = await newBed.save();
    res.status(201).send({
      success: true,
      message: 'Bed added succesfully.',
      data: bed,
    });
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

bedRoutes.delete('/deleteBed', authenticateJwt, async (req, res) => {
  try {
    const find = await Bed.findById(req.body.bedId);
    if (find) {
      await Bed.deleteOne({
        _id: req.body.bedId,
      });
      res.send({
        success: true,
        message: 'Room deleted successfully',
      });
    } else {
      res.status(404).send({ success: false, message: 'Room not found' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default bedRoutes;
