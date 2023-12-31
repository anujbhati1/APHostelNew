import express from 'express';
import User from '../models/userModal.js';
import jwt from 'jsonwebtoken';

const userRoutes = express.Router();

userRoutes.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      res.status(200).send({
        success: true,
        message: 'Login successful',
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'User not found.',
      });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

userRoutes.post('/signup', async (req, res) => {
  try {
    const findEmail = await User.findOne({
      email: req.body.email,
    });
    const findMobile = await User.findOne({
      mobileNo: req.body.mobileNo,
    });
    console.log(findEmail, findMobile);
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
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          mobileNo: req.body.mobileNo,
          password: req.body.password,
        });
        const user = await newUser.save();
        const token = jwt.sign({ username, role: 'user' }, SECRET, {
          expiresIn: '1h',
        });
        res.status(201).send({
          success: true,
          message: 'User registered succesfully.',
          data: user,
        });
      }
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default userRoutes;
