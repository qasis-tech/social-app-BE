import mongoose from "mongoose";
const adsSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("ads", adsSchema);
