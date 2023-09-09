import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    hostelId: { type: String, required: true },
    floorId: { type: String, required: true },
    roomId: { type: String, required: true },
    bedName: { type: String, required: true },
    amont: { type: Number },
    seatAvailible: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Bed = mongoose.model('Bed', bedSchema);

export default Bed;
