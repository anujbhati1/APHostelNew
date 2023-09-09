import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
    floorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
    roomName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
