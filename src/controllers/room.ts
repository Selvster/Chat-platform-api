import { Request, Response } from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsOfUser,
  joinRoom,
  leaveRoom,
} from "../services/room";
import { createRoomSchema, updateRoomSchema } from "../validations/room";
import catchAsync from "../utils/CatchAsync";
import AppError from "../utils/AppError";

export const createRoomController = catchAsync(
  async (req: Request, res: Response) => {
    const { error, value } = createRoomSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { name, description } = value;
    const ownerId = req.userId;

    if (!ownerId) {
      throw new AppError("User not authenticated.", 401);
    }

    const result = await createRoom(name, description, ownerId);

    res.status(201).json({
      status: "success",
      message: "Room created successfully!",
      data: { room: result.room },
    });
  }
);

// Controller to get all rooms
export const getAllRoomsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllRooms();

    res.status(200).json({
      status: "success",
      message: "Rooms fetched successfully!",
      results: result.rooms ? result.rooms.length : 0,
      data: { rooms: result.rooms },
    });
  }
);

export const getRoomByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getRoomById(id);

    res.status(200).json({
      status: "success",
      message: "Room fetched successfully!",
      data: { room: result.room },
    });
  }
);

// Controller to update a room
export const updateRoomController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error, value } = updateRoomSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const ownerId = req.userId;
    const roomToUpdateResult = await getRoomById(id);

    if (!roomToUpdateResult.room) {
      throw new AppError("Room not found.", 404);
    }

    if (roomToUpdateResult.room.owner._id.toString() !== ownerId) {
      throw new AppError("You are not authorized to update this room.", 403);
    }

    const result = await updateRoom(id, value);

    res.status(200).json({
      status: "success",
      message: "Room updated successfully!",
      data: { room: result.room },
    });
  }
);

export const deleteRoomController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ownerId = req.userId;
    const roomToDeleteResult = await getRoomById(id);
    if (!roomToDeleteResult.room) {
      throw new AppError("Room not found.", 404);
    }

    if (roomToDeleteResult.room.owner._id.toString() !== ownerId) {
      throw new AppError("You are not authorized to delete this room.", 403);
    }

    await deleteRoom(id);

    res.status(204).json({
      status: "success",
      message: "Room deleted successfully!",
      data: null,
    });
  }
);

export const getRoomsOfUserController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    const result = await getRoomsOfUser(userId);
    res.status(200).json({
      status: "success",
      message: "User rooms fetched successfully!",
      results: result.rooms ? result.rooms.length : 0,
      data: { rooms: result.rooms },
    });
  }
);

export const joinRoomController = catchAsync(
  async (req: Request, res: Response) => {
    const { code } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    const result = await joinRoom(code, userId);

    res.status(200).json({
      status: "success",
      message: "Successfully joined the room!",
      data: { room: result.room },
    });
  }
);

export const leaveRoomController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    const result = await leaveRoom(id, userId);

    res.status(200).json({
      status: "success",
      message: "Successfully left the room!",
      data: { room: result.room },
    });
  }
);
