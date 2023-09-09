import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    hostelId: { type: String, required: true },
    floorName: { type: String, required: true },
    seatAvailible: { type: Boolean, required: true },
    noOfseatAvai: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Floor = mongoose.model('Floor', floorSchema);

export default Floor;
