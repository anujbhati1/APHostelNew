import express from 'express';
import Bed from '../models/bedModal.js';
import { authenticateJwt } from '../middleware/auth.js';
import Room from '../models/roomModal.js';

const bedRoutes = express.Router();

bedRoutes.post('/getBeds', authenticateJwt, async (req, res) => {
  try {
    const findRoom = await Room.findOne({
      hostelId: req.body.hostelId,
      floorId: req.body.floorId,
      _id: req.body.roomId,
    });
    if (findRoom) {
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
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

bedRoutes.post('/addBed', authenticateJwt, async (req, res) => {
  try {
    const findRoom = await Room.findOne({
      userId: req.body.userId,
      hostelId: req.body.hostelId,
      floorId: req.body.floorId,
      _id: req.body.roomId,
    });
    if (findRoom) {
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
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
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
        message: 'Bed deleted successfully',
      });
    } else {
      res.status(404).send({ success: false, message: 'Bed not found' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default bedRoutes;
