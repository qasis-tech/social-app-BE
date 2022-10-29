import mongoose from "mongoose";
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    comments: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("posts", postSchema);
