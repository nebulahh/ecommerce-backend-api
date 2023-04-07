import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = (req.headers?.authorization as string) || (req.headers?.Authorization as string);

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      // console.log(decoded);
      req.user = decoded.UserInfo?.email;
      
      // req.roles = decoded.UserInfo.roles
      next();
    });
}

export function localVariable(req: Request, res: Response, next: NextFunction) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };

  next();
}