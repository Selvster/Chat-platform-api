import Room from "../models/Room";
import AppError from "../utils/AppError";

import { IRoom, RoomServiceResponse } from "../types";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";
export const createRoom = async (
  name: string,
  description: string,
  ownerId: string
): Promise<RoomServiceResponse> => {
  try {
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      throw new AppError(
        "Room name already exists. Please choose a different name.",
        400
      );
    }

    const newRoom = new Room({
      name,
      description,
      owner: ownerId,
      members: [ownerId],
      code: new mongoose.Types.ObjectId().toString() + Math.random().toString(36).substring(2, 8) 
    });

    await newRoom.save();
    return { room: newRoom };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Server error creating room.", 500);
  }
};

export const getAllRooms = async (): Promise<RoomServiceResponse> => {
  try {
    const rooms = await Room.find()
      .populate("owner", "username email")
      .populate("members", "username email");
    return { rooms };
  } catch (error) {
    throw new AppError("Server error fetching rooms.", 500);
  }
};

export const getRoomById = async (
  roomId: string
): Promise<RoomServiceResponse> => {
  try {
    const room = await Room.findById(roomId)
      .populate("owner", "username email")
      .populate("members", "username email");
    if (!room) {
      throw new AppError("Room not found.", 404);
    }
    return { room };
  } catch (error: any) {
    throw new AppError("Server error fetching room.", 500);
  }
};

export const updateRoom = async (
  roomId: string,
  updates: Partial<IRoom>
): Promise<RoomServiceResponse> => {
  try {
    const room = await Room.findByIdAndUpdate(roomId, updates, {
      new: true,
      runValidators: true,
    });
    if (!room) {
      throw new AppError("Room not found.", 404);
    }
    return { room };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Server error updating room.", 500);
  }
};

export const deleteRoom = async (
  roomId: string
): Promise<RoomServiceResponse> => {
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      throw new AppError("Room not found.", 404);
    }
    return {};
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Server error deleting room.", 500);
  }
};

export const getRoomsOfUser = async (
  userId: string
): Promise<RoomServiceResponse> => {
  try {
    const rooms = await Room.find({ members: userId })
      .populate("owner", "username email")
      .populate("members", "username email");
    return { rooms };
  } catch (error: any) {
    throw new AppError("Server error fetching user rooms.", 500);
  }
};

export const joinRoom = async (code: string, userId: string): Promise<RoomServiceResponse> => {
  try {
    const room = await Room.findOne({code});

    if (!room) {
      throw new AppError('Room not found.', 404);
    }

    const isMember = room.members.some(memberId => memberId.toString() === userId);

    if (isMember) {
      throw new AppError('You are already a member of this room.', 400);
    }

    room.members.push(new mongoose.Types.ObjectId(userId));
    await room.save();


    return { room };
  } catch (error: any) {
    console.error('Room service (joinRoom) error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Server error joining room.', 500);
  }
};

export const leaveRoom = async (roomId: string, userId: string): Promise<RoomServiceResponse> => {
  try {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new AppError('Room not found.', 404);
    }
    const isMember = room.members.some(memberId => memberId.toString() === userId);

    if (!isMember) {
      throw new AppError('You are not a member of this room.', 400);
    }

    if (room.owner.toString() === userId) {
      throw new AppError('Owner cannot leave the room.', 403);
    }

    room.members = room.members.filter(memberId => memberId.toString() !== userId);
    await room.save();
    return { room };
  }
  catch (error: any) {
    console.error('Room service (leaveRoom) error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Server error leaving room.', 500);
  } 
};