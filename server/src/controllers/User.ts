import z from "zod";
import { Request, Response } from "express";
import { UserModel } from "../database/Schema.js";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const inputValidation = z.object({
      username: z.string(),
      password: z.string(),
    });

    const validation = inputValidation.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues,
      });
    }

    const { username, password } = validation.data;

    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return res.status(403).json({
        message: "Invalid Credentials",
      });
    }

    const isMatched = await bycrpt.compare(password, existingUser.password);

    if (isMatched) {
      const payload = {
        userId: existingUser._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECERET as string, {
        expiresIn: "24h",
      });

      return res.status(200).json({ token });
    } else {
      return res.status(403).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const inputSchema = z.object({
      username: z.string().min(3).max(50),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/\d/, "Password must include at least one number")
        .regex(
          /[^a-zA-Z0-9]/,
          "Password must include at least one special character",
        ),
    });

    const isInputCorrect = inputSchema.safeParse(req.body);

    if (!isInputCorrect.success) {
      return res.status(400).json({
        error: isInputCorrect.error.issues,
      });
    }

    const { username, password } = isInputCorrect.data;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(403).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    const trimmedUsername = username.split(" ")[0];

    await UserModel.create({
      username: trimmedUsername,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "User Register Succesfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const response = await UserModel.findOne({ _id: userId });
    if (!response) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      response,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
