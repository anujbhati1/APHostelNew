import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Room from '../models/roomModal.js';
import Hostel from '../models/hostelModal.js';
import Floor from '../models/floorModal.js';

const roomRoutes = express.Router();

roomRoutes.post('/getRooms', async (req, res) => {
  const rooms = await Room.find({
    hostelId: req.body.hostelId,
    floorId: req.body.floorId,
  });
  res.status(200).send({
    success: true,
    message: 'Succesfully get rooms',
    data: rooms,
  });
});

roomRoutes.post('/getAllEmptyRooms', async (req, res) => {
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
});

roomRoutes.post(
  '/addRoom',
  expressAsyncHandler(async (req, res) => {
    const newRoom = new Room({
      userId: req.body.userId,
      hostelId: req.body.hostelId,
      floorId: req.body.floorId,
      roomName: req.body.roomName,
      seatAvailible: req.body.seatAvailible,
      totalSeat: req.body.totalSeat,
      noOfSeatAvai: req.body.noOfSeatAvai,
      amont: req.body.amont,
    });
    const room = await newRoom.save();
    res.status(201).send({
      success: true,
      message: 'Room added succesfully.',
      data: room,
    });
  })
);

roomRoutes.delete(
  '/deleteRoom',
  expressAsyncHandler(async (req, res) => {
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
  })
);

export default roomRoutes;
