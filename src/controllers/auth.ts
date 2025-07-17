import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth"; 
import { registerSchema, loginSchema } from "../validations/auth"; 
import catchAsync from "../utils/CatchAsync";
import AppError from "../utils/AppError";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { username, email, password } = value;

  const result = await registerUser(username, email, password);

  if (result.success) {
    res.status(201).json({ message: result.message, user: result.user, token: result.token });
  } else {
    throw new AppError(result.message, 400);
  }
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { email, password } = value;

  const result = await loginUser(email, password);

  if (result.success && result.token) {
    res
      .status(200)
      .json({ message: result.message, user: result.user, token: result.token });
  } else {
    throw new AppError(result.message, 400);
  }
});
