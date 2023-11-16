import express from 'express';
import Tenat from '../models/tenatModal.js';
import Bed from '../models/bedModal.js';
import { authenticateJwt } from '../middleware/auth.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images',
  allowedFormats: ['jpg', 'png'],
  // transformation: [{ width: 500, height: 500, crop: 'limit' }],
});

const upload = multer({ storage: storage });

const tenatRoutes = express.Router();

tenatRoutes.post(
  '/addTenat',
  authenticateJwt,
  upload.fields([
    { name: 'aadharImgFrnt', maxCount: 1 },
    { name: 'aadharImgBck', maxCount: 1 },
  ]),
  async (req, res) => {
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
          salary: req.body.salary,
        });

        if (
          req.files['aadharImgFrnt'][0].path &&
          req.files['aadharImgFrnt'][0].filename
        ) {
          newTenat.aadharImgFrnt = req.files['aadharImgFrnt'][0].path;
          newTenat.aadharFrntPId = req.files['aadharImgFrnt'][0].filename;
        }

        if (
          req.files['aadharImgBck'][0].path &&
          req.files['aadharImgBck'][0].filename
        ) {
          newTenat.aadharImgBck = req.files['aadharImgBck'][0].path;
          newTenat.aadharBckPId = req.files['aadharImgBck'][0].filename;
        }

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
        res
          .status(404)
          .json({ success: false, message: 'Invalid Credentials' });
      }
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
);

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

tenatRoutes.delete('/deleteTenat/:id', authenticateJwt, async (req, res) => {
  try {
    const findTenat = await Tenat.findOne({ _id: req.params.id });
    if (findTenat) {
      if (findTenat.aadharFrntPId) {
        await cloudinary.uploader.destroy(findTenat.aadharFrntPId);
      }
      if (findTenat.aadharBckPId) {
        await cloudinary.uploader.destroy(findTenat.aadharBckPId);
      }
      await Tenat.deleteOne({ _id: req.params.id });
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

tenatRoutes.get('/getTenat/:id', authenticateJwt, async (req, res) => {
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
