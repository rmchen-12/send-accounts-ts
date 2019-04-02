import { Request, Response } from "express";
import formidable from "formidable";
import fs from "fs";
import { getPath, responseClient } from "../utils";

export const handleImage = (req: Request, res: Response) => {
  res.sendFile(getPath(req.url));
};

export const uploadImage = (req: Request, res: Response) => {
  const image: string[] = fs.readdirSync(getPath("static/image"));
  if (image[0]) {
    fs.unlinkSync(getPath(`static/image/${image[0]}`));
  }

  const form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.uploadDir = getPath("static/image");
  form.keepExtensions = true; // 保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.parse(req);

  responseClient(
    res,
    200,
    0,
    "success",
    fs.readdirSync(getPath("static/image"))
  );
};

export const getBanner = (req: Request, res: Response) => {
  const img = fs.readdirSync(getPath("static/image"));
  responseClient(res, 200, 0, "success", `static/image/${img}`);
};
