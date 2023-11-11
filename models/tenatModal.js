import mongoose from 'mongoose';

const tenatSchema = new mongoose.Schema({
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
  tName: { type: String, required: true },
  tMobile: { type: String },
  tParentMobile: { type: String },
  joiningDate: { type: Date },
  secDepoAmt: { type: Number },
  isStaff: { type: Boolean, default: false },
  paymentDetails: [
    {
      paymentDate: { type: Date },
      paymentAmt: { type: Number },
    },
  ],
});

const Tenat = mongoose.model('Tenat', tenatSchema);

export default Tenat;
