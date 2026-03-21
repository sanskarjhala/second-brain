import { Response, Request } from "express";
import { ContentModel } from "../database/Schema";

export const createContent = async (req: Request, res: Response) => {
  try {
    const { link, type, title } = req.body;
    const userId = req.userId;

    await ContentModel.create({
      title: title,
      link: link,
      userId: userId,
      type: type,
    });

    res.status(200).json({
      message: "Content Added",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getContent = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const content = await ContentModel.find({
      userId: userId,
    });
    return res.status(200).json({
      content,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await ContentModel.deleteMany({
      _id: id,
    });
    return res.status(200).json({
      message: "Content Deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
