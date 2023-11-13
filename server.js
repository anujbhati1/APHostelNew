import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
import hostelRoutes from './routes/hostelRoutes.js';
import floorRoutes from './routes/floorRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bedRoutes from './routes/bedRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import tenatRoutes from './routes/tenatRoutes.js';
import foodRoutes from './routes/foodRoutes.js';

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // .connect('mongodb://localhost:27017/Hostel')
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api', hostelRoutes);
app.use('/api', floorRoutes);
app.use('/api', roomRoutes);
app.use('/api', bedRoutes);
app.use('/api', tenatRoutes);
app.use('/api', foodRoutes);

app.use((err, req, res, next) => {
  res.status(500).send({ success: false, message: err.message });
});

function started() {
  console.log(`Server is running at http://localhost:${port}`);
}

app.listen(port, started);
