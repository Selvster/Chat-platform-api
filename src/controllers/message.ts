import { Request, Response } from "express";
import { createMessage, getRoomMessages } from "../services/message";
import { createMessageSchema } from "../validations/message";
import catchAsync from "../utils/CatchAsync";
import AppError from "../utils/AppError";

export const createMessageController = catchAsync(
  async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { content } = req.body;
    const senderId = req.userId;

    const { error, value } = createMessageSchema.validate({ content });
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    if (!senderId) {
      throw new AppError("User not authenticated.", 401);
    }

    const result = await createMessage(roomId, senderId, value.content);

    res.status(201).json({
      status: "success",
      message: "Message sent successfully!",
      data: { message: result.message },
    });
  }
);

export const getRoomMessagesController = catchAsync(
  async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const result = await getRoomMessages(roomId, limit, skip);

    res.status(200).json({
      status: "success",
      message: "Messages fetched successfully!",
      results: result.messages ? result.messages.length : 0,
      data: { messages: result.messages },
    });
  }
);
