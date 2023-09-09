import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
    floorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
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
