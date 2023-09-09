import express from 'express';
import Room from '../models/roomModal.js';
import Hostel from '../models/hostelModal.js';
import Floor from '../models/floorModal.js';
import { authenticateJwt } from '../middleware/auth.js';

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

roomRoutes.post('/getAllEmptyRooms', authenticateJwt, async (req, res) => {
  try {
    let hostels = await Hostel.find({
      userId: req.body.userId,
    });
    let floors = await Floor.find({
      userId: req.body.userId,
    });
    let rooms = await Room.find({
      seatAvailible: true,
      userId: req.body.userId,
    });

    function getAllRooms() {
      let temArr = [];
      for (let i = 0; i < rooms.length; i++) {
        for (let k = 0; k < floors.length; k++) {
          for (let j = 0; j < hostels.length; j++) {
            if (
              rooms[i].hostelId == hostels[j]._id + '' &&
              rooms[i].floorId == floors[k]._id + ''
            ) {
              temArr.push({
                ...rooms[i].toObject(),
                hostelData: hostels[j].toObject(),
                floorData: floors[k].toObject(),
              });
            }
          }
        }
      }
      return temArr;
    }

    const data = getAllRooms();

    res.status(200).send({
      success: true,
      message: 'Succesfully get rooms',
      data: data,
    });
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
