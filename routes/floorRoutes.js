import express from 'express';
import Floor from '../models/floorModal.js';
import { authenticateJwt } from '../middleware/auth.js';
import Hostel from '../models/hostelModal.js';
import Room from '../models/roomModal.js';
import Bed from '../models/bedModal.js';

const floorRoutes = express.Router();

floorRoutes.post('/getFloors', authenticateJwt, async (req, res) => {
  try {
    const findHostel = await Hostel.findOne({ _id: req.body.hostelId });
    if (findHostel) {
      const floors = await Floor.find({ hostelId: req.body.hostelId });
      res.status(200).send({
        success: true,
        message: 'Succesfully get floors',
        data: floors,
      });
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

floorRoutes.post('/addFloor', authenticateJwt, async (req, res) => {
  try {
    const findHostel = await Hostel.findOne({
      userId: req.body.userId,
      _id: req.body.hostelId,
    });
    if (findHostel) {
      const newFloor = new Floor({
        userId: req.body.userId,
        hostelId: req.body.hostelId,
        floorName: req.body.floorName,
      });
      const floor = await newFloor.save();
      res.status(201).send({
        success: true,
        message: 'Floor added succesfully.',
        data: floor,
      });
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

floorRoutes.delete('/deleteFloor', authenticateJwt, async (req, res) => {
  try {
    const find = await Floor.findById(req.body.floorId);
    if (find) {
      await Floor.deleteOne({
        _id: req.body.floorId,
      });
      await Room.deleteOne({
        floorId: req.body.floorId,
      });
      await Bed.deleteMany({
        floorId: req.body.floorId,
      });
      res.send({
        success: true,
        message: 'Floor deleted successfully',
      });
    } else {
      res.status(404).send({ success: false, message: 'Floor not found' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default floorRoutes;
