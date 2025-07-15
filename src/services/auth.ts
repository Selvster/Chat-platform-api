import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthResponse } from "../types"; 

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_EXPIRATION_IN_SECONDS?: string;
    }
  }
}

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "User with this email already exists" };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    await newUser.save();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return { success: false, message: "Server configuration error" };
    }

    const expiresInSeconds = Number(process.env.JWT_EXPIRATION_IN_SECONDS) || 604800; 

    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email },
      jwtSecret,
      { expiresIn: expiresInSeconds } 
    );

    return {
      success: true,
      message: "Registration successful!", 
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      },
      token,
    };
  } catch (error: any) {
    console.error("Registration service error:", error);
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.username) {
        return { success: false, message: "Username is already taken." };
      }
      if (error.keyPattern && error.keyPattern.email) {
        return { success: false, message: "Email is already registered." };
      }
    }
    return { success: false, message: "Server error during registration" };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return { success: false, message: "Server configuration error" };
    }

    const expiresInSeconds = Number(process.env.JWT_EXPIRATION_IN_SECONDS) || 604800; 

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      jwtSecret,
      { expiresIn: expiresInSeconds } 
    );

    return {
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login service error:", error);
    return { success: false, message: "Server error during login" };
  }
};
