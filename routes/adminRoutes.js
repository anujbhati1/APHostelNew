import express from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../middleware/auth.js';
import Admin from '../models/adminModal.js';

const adminRoutes = express.Router();

adminRoutes.post('/login', async (req, res) => {
  try {
    const user = await Admin.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      const token = jwt.sign(
        { username: req.body.email, role: 'admin' },
        SECRET,
        {
          expiresIn: '1h',
        }
      );
      res.status(200).send({
        success: true,
        message: 'Login successful',
        token,
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Invalid credentials',
      });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

adminRoutes.post('/signup', async (req, res) => {
  try {
    const findEmail = await Admin.findOne({
      email: req.body.email,
    });
    const findMobile = await Admin.findOne({
      mobileNo: req.body.mobileNo,
    });
    if (findEmail) {
      res.status(409).send({
        success: false,
        message: 'Email is already registered.',
      });
    } else {
      if (findMobile) {
        res.status(409).send({
          success: false,
          message: 'Mobile already registered.',
        });
      } else {
        const newUser = new Admin({
          name: req.body.name,
          email: req.body.email,
          mobileNo: req.body.mobileNo,
          password: req.body.password,
        });
        const user = await newUser.save();
        const token = jwt.sign(
          { username: req.body.email, role: 'admin' },
          SECRET,
          {
            expiresIn: '1h',
          }
        );
        res.status(201).send({
          success: true,
          message: 'Admin registered succesfully.',
          token,
          data: user,
        });
      }
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default adminRoutes;
