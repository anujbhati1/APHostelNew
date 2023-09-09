import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    hostelName: { type: String, required: true, unique: true },
    seatAvailible: { type: Boolean, required: true },
    noOfseatAvai: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Hostel = mongoose.model('Hostel', hostelSchema);

export default Hostel;
