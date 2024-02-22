import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

//check if the user is authenticated in cookies and if not, return error
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        username: string;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}
interface decodeType {
  userData: {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.cookies["Authorization"];
  console.log(authorization);
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const userData = decoded as decodeType;
    console.log(userData.userData);
    req.user = userData.userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized: Admin only" });
  }
  next();
};




