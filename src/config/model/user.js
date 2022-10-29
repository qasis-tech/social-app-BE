import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    age: {
      type: Number,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    bio: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    role: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    userStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("users", userSchema);
