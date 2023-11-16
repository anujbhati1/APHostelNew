import mongoose from 'mongoose';

const tenatSchema = new mongoose.Schema({
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
  tName: { type: String, required: true },
  tMobile: { type: String },
  tParentMobile: { type: String },
  tParentName: { type: String },
  tAadharNo: { type: String },
  joiningDate: { type: Date },
  secDepoAmt: { type: Number },
  isStaff: { type: Boolean, default: false },
  aadharImgFrnt: { type: String },
  aadharFrntPId: { type: String },
  aadharImgBck: { type: String },
  aadharBckPId: { type: String },
  salary: { type: Number },
  paymentDetails: [
    {
      paymentDate: { type: Date },
      paymentAmt: { type: Number },
      description: { type: String },
    },
  ],
});

const Tenat = mongoose.model('Tenat', tenatSchema);

export default Tenat;
