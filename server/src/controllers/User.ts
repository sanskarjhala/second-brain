import z from "zod";
import { Request, Response } from "express";
import { UserModel } from "../database/Schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  try {
    const inputSchema = z.object({
      emailID: z.string().email(),
      password: z.string(),
    });
    const isInputCorrect = inputSchema.safeParse(req.body);
    if (!isInputCorrect.success) {
      return res.status(411).json({
        message: "Invalid input formate.",
        error: isInputCorrect.error,
      });
    }

    const { password, emailID } = req.body;

    const findUserGmail = await UserModel.findOne({
      emailID: emailID,
    });
    if (!findUserGmail) {
      return res.status(403).json({
        message: "Incorrect ceredentials -> email",
      });
    }
    const passwordCheck = await bcrypt.compare(
      password,
      findUserGmail.password,
    );
    if (!passwordCheck) {
      return res.status(403).json({
        message: "Incorrect ceredentials -> password",
      });
    }
    //@ts-ignore
    const token = jwt.sign({ id: findUserGmail._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Signed in successfully",
      Token: token,

      user: {
        isDemo: findUserGmail.isDemo,
        username: findUserGmail.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in signining in.",
      Error: error,
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const inputSchema = z.object({
      emailID: z.string().email(),
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
      return res.status(411).json({
        message: "Invalid input formate.",
        error: isInputCorrect.error,
      });
    }

    const { emailID, password, username } = req.body;
    const ExistingUser = await UserModel.findOne({ emailID });
    if (ExistingUser) {
      return res.status(403).json({
        message: "User already exist, Try with another EmailId",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const trimmedUsername = username.split(" ")[0].slice(0, 10);

    await UserModel.create({
      emailID,
      password: hashedPassword,
      username: trimmedUsername,
      isDemo: false,
      expireAt: null, // not expires the real user.
    });

    return res.status(200).json({
      message: "you have successfully signed up.",
    });
  } catch (error: any) {
    if (error.code == 11000) {
      return res.status(403).json({
        message: "user already exist",
      });
    }
    return res.status(500).json({
      message: "something went wrong, Error in signing up",
    });
  }
};

export const demoUser = async (req: Request, res: Response) => {
  try {
    const uniqueId = `demo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const demoUser = await UserModel.create({
      emailID: `${uniqueId}@demo.com`,
      username: "Guest",
      password: "ABCDabcd1234",
      isDemo: true,
      expireAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours TTL
    });

    const token = jwt.sign(
      { id: demoUser._id, isDemo: true },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" },
    );

    return res.json({
      message: "Demo session started",
      token,
      username: demoUser.username,
      isDemo: true,
    });
  } catch (err: any) {
    console.error("❌ DEMO LOGIN ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to start demo session", error: err.message });
  }
};
