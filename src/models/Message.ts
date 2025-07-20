import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types";
const MessageSchema: Schema = new Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ room: 1, createdAt: 1 });

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
