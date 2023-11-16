import express from 'express';
import Tenat from '../models/tenatModal.js';
import Bed from '../models/bedModal.js';
import { authenticateJwt } from '../middleware/auth.js';

const tenatRoutes = express.Router();

tenatRoutes.post('/addTenat', authenticateJwt, async (req, res) => {
  try {
    const findBed = await Bed.findOne({ _id: req.body.bedId });
    if (findBed) {
      const newTenat = new Tenat({
        bedId: req.body.bedId,
        tName: req.body.tName,
        tMobile: req.body.tMobile,
        tParentMobile: req.body.tParentMobile,
        joiningDate: req.body.joiningDate,
        secDepoAmt: req.body.secDepoAmt,
        isStaff: req.body.isStaff,
        aadhaeImgFrnt: req.body.aadhaeImgFrnt,
        aadhaeImgBck: req.body.aadhaeImgBck,
        salary: req.body.salary,
      });

      if (req.body.paymentDate && req.body.paymentAmt) {
        newTenat.paymentDetails = [
          {
            paymentDate: req.body.paymentDate,
            paymentAmt: req.body.paymentAmt,
            description: req.body.description,
          },
        ];
      }

      const tenat = await newTenat.save();
      res.status(201).send({
        success: true,
        message: 'Student added succesfully.',
        data: tenat,
      });
    } else {
      res.status(404).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

tenatRoutes.post('/addTenatRent', authenticateJwt, async (req, res) => {
  try {
    const findTenat = await Tenat.updateOne(
      { _id: req.body.tenatId },
      {
        $push: {
          paymentDetails: {
            paymentDate: req.body.paymentDate,
            paymentAmt: req.body.paymentAmt,
            description: req.body.description,
          },
        },
      }
    );
    if (findTenat) {
      res.status(201).send({
        success: true,
        message: 'Rent save succesfully.',
      });
    } else {
      res.status(404).json({ success: false, message: 'Rent not saved.' });
    }
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

tenatRoutes.delete('/deleteTenat', authenticateJwt, async (req, res) => {
  try {
    const findTenat = await Tenat.findOne({ _id: req.body.tenatId });
    if (findTenat) {
      await Tenat.deleteOne({ _id: req.body.tenatId });
      res.send({
        success: true,
        message: 'Tenat deleted successfully',
      });
    } else {
      res.status(404).json({ success: false, message: 'Can not find tenat.' });
    }
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: 'Not able to delete tenat.' });
  }
});

tenatRoutes.get('/getTenat/:id', async (req, res) => {
  try {
    const findTenat = await Tenat.findOne({ _id: req.params.id });
    if (findTenat) {
      res.send({
        success: true,
        message: 'Tenat Get successfully',
        data: findTenat,
      });
    } else {
      res.status(404).json({ success: false, message: 'Can not find tenat.' });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Not able to find tenat with this id.',
    });
  }
});

export default tenatRoutes;
