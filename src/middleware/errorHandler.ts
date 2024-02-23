import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 404;
  error.status = error.status || "Fail";
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
