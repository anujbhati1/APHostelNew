import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  hostelName: { type: String, required: true, unique: true },
  hostelAddress: { type: String },
  hostelMapLink: { type: String },
  hostelLat: { type: Number },
  hostelLng: { type: Number },
  hostelImage: { type: String },
  imgPublicId: { type: String },
});

const Hostel = mongoose.model('Hostel', hostelSchema);

export default Hostel;
