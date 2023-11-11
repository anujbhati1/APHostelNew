import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  hostelName: { type: String, required: true, unique: true },
  hostelAddress: { type: String },
});

const Hostel = mongoose.model('Hostel', hostelSchema);

export default Hostel;
