import Message from "../models/Message";
import Room from "../models/Room";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import { MessageServiceResponse } from "../types";

export const createMessage = async (
  roomId: string,
  senderId: string,
  content: string
): Promise<MessageServiceResponse> => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new AppError("Room not found.", 404);
    }
    const isMember = room.members.some((memberId) =>
      memberId.equals(new mongoose.Types.ObjectId(senderId))
    );
    if (!isMember) {
      throw new AppError("You are not a member of this room.", 403);
    }

    const newMessage = new Message({
      room: roomId,
      sender: senderId,
      content,
    });

    await newMessage.save();
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "username"
    );

    return { message: populatedMessage! };
  } catch (error: any) {
    console.error("Message service (createMessage) error:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Server error creating message.", 500);
  }
};

export const getRoomMessages = async (
  roomId: string,
  limit: number = 50,
  skip: number = 0
): Promise<MessageServiceResponse> => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new AppError("Room not found.", 404);
    }

    const messages = await Message.find({ room: roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    return { messages };
  } catch (error: any) {
    console.error("Message service (getRoomMessages) error:", error);
    if (error instanceof AppError) {
      throw error;
    }
    if (error.name === "CastError" && error.path === "room") {
      throw new AppError("Invalid room ID format.", 400);
    }
    throw new AppError("Server error fetching messages.", 500);
  }
};
