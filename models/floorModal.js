import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  floorName: { type: String, required: true },
});

const Floor = mongoose.model('Floor', floorSchema);

export default Floor;
