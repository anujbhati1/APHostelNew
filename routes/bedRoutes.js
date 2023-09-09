import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Bed from '../models/bedModal.js';

const bedRoutes = express.Router();

bedRoutes.post('/getBeds', async (req, res) => {
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
});

bedRoutes.post(
  '/addBed',
  expressAsyncHandler(async (req, res) => {
    const newBed = new Bed({
      userId: req.body.userId,
      hostelId: req.body.hostelId,
      floorId: req.body.floorId,
      roomId: req.body.roomId,
      bedName: req.body.bedName,
      amont: req.body.amont,
      seatAvailible: req.body.seatAvailible,
      cName: req.body.cName,
      monthStart: req.body.monthStart,
      mobileNo: req.body.mobileNo,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      pendingAmt: req.body.pendingAmt,
      duesClear: req.body.duesClear,
    });
    const bed = await newBed.save();
    res.status(201).send({
      success: true,
      message: 'Bed added succesfully.',
      data: bed,
    });
  })
);

bedRoutes.delete(
  '/deleteBed',
  expressAsyncHandler(async (req, res) => {
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
  })
);

export default bedRoutes;
