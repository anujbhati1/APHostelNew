import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Floor from '../models/floorModal.js';
import { authenticateJwt } from '../middleware/auth.js';

const floorRoutes = express.Router();

floorRoutes.post('/getFloors', authenticateJwt, async (req, res) => {
  const floors = await Floor.find({ hostelId: req.body.hostelId });
  res.status(200).send({
    success: true,
    message: 'Succesfully get floors',
    data: floors,
  });
});

floorRoutes.post(
  '/addFloor',
  authenticateJwt,
  expressAsyncHandler(async (req, res) => {
    const newFloor = new Floor({
      userId: req.body.userId,
      hostelId: req.body.hostelId,
      floorName: req.body.floorName,
      seatAvailible: req.body.seatAvailible,
      noOfseatAvai: req.body.noOfseatAvai,
    });
    const floor = await newFloor.save();
    res.status(201).send({
      success: true,
      message: 'Floor added succesfully.',
      data: floor,
    });
  })
);

floorRoutes.delete(
  '/deleteFloor',
  authenticateJwt,
  expressAsyncHandler(async (req, res) => {
    const find = await Floor.findById(req.body.floorId);
    if (find) {
      await Floor.deleteOne({
        _id: req.body.floorId,
      });
      res.send({
        success: true,
        message: 'Floor deleted successfully',
      });
    } else {
      res.status(404).send({ success: false, message: 'Floor not found' });
    }
  })
);

export default floorRoutes;
