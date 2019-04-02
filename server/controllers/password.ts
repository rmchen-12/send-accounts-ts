import { Request, Response } from "express";
import { Password } from "../models/password";
import { responseClient } from "../utils";

export const updatePassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const passwords = await Password.find();

  await Password.updateOne({ password: passwords[0].password }, { password });

  responseClient(res, 200, 0, "更新成功");
};

export const getPassword = async (req: Request, res: Response) => {
  const passwords = await Password.find();
  responseClient(res, 200, 0, "success", passwords[0].password);
};
