import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(  
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // lagrar MongoDB is för en änvandare
      ref: "User",
      required: true // varje task måste tillhöra en användare
    },
    title: {
      type: String,
      required: true // task måste ha en title
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);