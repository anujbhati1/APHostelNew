import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    foodTitle: { type: String },
    foodImg: { type: String },
    imgPublicId: { type: String },
    foodName: { type: String },
  },
  { timestamps: true }
);

const Food = mongoose.model('Food', foodSchema);

export default Food;
