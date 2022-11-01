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
    user: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("posts", postSchema);
