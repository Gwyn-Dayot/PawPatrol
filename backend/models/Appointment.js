import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },

  date: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Rescheduled"],
    default: "Pending",
  },

  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);