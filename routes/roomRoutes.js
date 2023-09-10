import express from 'express';
import Room from '../models/roomModal.js';
import Floor from '../models/floorModal.js';
import { authenticateJwt } from '../middleware/auth.js';
import Bed from '../models/bedModal.js';
import Admin from '../models/adminModal.js';
import { ObjectId } from 'mongodb';

const roomRoutes = express.Router();

roomRoutes.post('/getRooms', authenticateJwt, async (req, res) => {
  try {
    const findFloor = await Floor.findOne({
      hostelId: req.body.hostelId,
      _id: req.body.floorId,
    });
    if (findFloor) {
      const rooms = await Room.find({
        hostelId: req.body.hostelId,
        floorId: req.body.floorId,
      });
      res.status(200).send({
        success: true,
        message: 'Succesfully get rooms',
        data: rooms,
      });
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

roomRoutes.post('/getAllRooms', authenticateJwt, async (req, res) => {
  const userId = new ObjectId(req.body.userId);
  const seatAvailible = req.body.seatAvailible;

  try {
    const admin = await Admin.findOne({ _id: req.body.userId });
    if (admin) {
      let allRooms = await Bed.aggregate([
        {
          $match: {
            userId: userId,
            seatAvailible: seatAvailible,
          },
        },
        {
          $lookup: {
            from: 'hostels',
            localField: 'hostelId',
            foreignField: '_id',
            as: 'hostelDetails',
          },
        },
        {
          $unwind: '$hostelDetails',
        },
        {
          $lookup: {
            from: 'floors',
            localField: 'floorId',
            foreignField: '_id',
            as: 'floorDetails',
          },
        },
        {
          $unwind: '$floorDetails',
        },
        {
          $lookup: {
            from: 'rooms',
            localField: 'roomId',
            foreignField: '_id',
            as: 'roomDetails',
          },
        },
        {
          $unwind: '$roomDetails',
        },
        {
          $project: {
            _id: 1,
            roomId: 1,
            floorId: 1,
            hostelId: 1,
            amont: 1,
            seatAvailible: 1,
            userId: 1,
            bedName: 1,
            hostelName: '$hostelDetails.hostelName',
            floorName: '$floorDetails.floorName',
            roomName: '$roomDetails.roomName',
          },
        },
      ]);

      res.status(200).send({
        success: true,
        message: 'Succesfully get rooms',
        data: allRooms,
      });
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

roomRoutes.post('/addRoom', authenticateJwt, async (req, res) => {
  try {
    const findFloor = await Floor.findOne({
      userId: req.body.userId,
      hostelId: req.body.hostelId,
      _id: req.body.floorId,
    });
    if (findFloor) {
      const newRoom = new Room({
        userId: req.body.userId,
        hostelId: req.body.hostelId,
        floorId: req.body.floorId,
        roomName: req.body.roomName,
      });
      const room = await newRoom.save();
      res.status(201).send({
        success: true,
        message: 'Room added succesfully.',
        data: room,
      });
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

roomRoutes.delete('/deleteRoom', authenticateJwt, async (req, res) => {
  try {
    const find = await Room.findById(req.body.roomId);
    if (find) {
      await Room.deleteOne({
        _id: req.body.roomId,
      });
      await Bed.deleteMany({
        roomId: req.body.roomId,
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

export default roomRoutes;
