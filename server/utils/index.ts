import { Response } from "express";
import path from "path";

export const getPath = (file: string): string =>
  path.join(__dirname, "../..", file);

export const responseClient = (
  res: Response,
  httpCode = 500,
  code = 3,
  message = "服务端异常",
  data = {}
) => {
  const responseData = {} as app.responseData;
  responseData.code = code;
  responseData.message = message;
  responseData.data = data;
  res.status(httpCode).json(responseData);
};

export const countName = (arr: string[], item: string) => {
  const count: string[] = arr.filter((a: string) => {
    return a === item;
  });
  return count.length;
};
