import { NextFunction } from "express";
import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";

export interface IUser {
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const ContentTypes = [
  "image",
  "youtube",
  "article",
  "audio",
  "twitter",
  "docs",
]; // extending as per needs

// const contentSchema = new Schema({
//   title: { type: String, required: true },
//   link: { type: String, required: true },
//   type: { type: String, enum: ContentTypes, required: true },
//   content: { type: String},
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// });

const contentSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, enum: ContentTypes, required: true },
  content: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["processing", "ready", "failed"],
    default: "processing",
  },
  chromaSource: { type: String },
});

const tagSchema = new Schema({
  title: { type: String, required: true, unique: true },
});

const linkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

userSchema.post(
  "save",
  function (error: any, doc: IUser, next: (err?: any) => void) {
    if (error?.name === "MongoServerError" && error?.code === 11000) {
      next(new Error("Username already exists"));
    } else {
      next(error);
    }
  },
);

export const ContentModel = mongoose.model("Content", contentSchema);
export const TagSchema = mongoose.model("Tag", tagSchema);
export const UserModel = mongoose.model("User", userSchema);
export const LinkModel = mongoose.model("Link", linkSchema);
