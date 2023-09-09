import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    hostelId: { type: String, required: true },
    floorId: { type: String, required: true },
    roomName: { type: String, required: true },
    seatAvailible: { type: Boolean, required: true },
    totalSeat: { type: Number, required: true },
    noOfSeatAvai: { type: Number },
    amont: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
