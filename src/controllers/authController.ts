import { Request, Response } from 'express';
// import { FilterQuery } from 'mongoose';
import { validationResult } from 'express-validator';
import UserModel from '../models/userModel';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function loginUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  const existingUser = await UserModel.findOne({ email }).exec();
  
  // Todo
  // add a property on the user model that check they are active or deleted
  if (!existingUser) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  const isValid = await bcrypt.compare(password, existingUser.password);
  console.log(!isValid);

  if (!isValid) {
    return res.status(401).json({ message: 'Unauthorized password' });
  }

  const accessToken = jwt.sign(
    {
      'userInfo': {
        'email': existingUser.email,
        // TODO: define roles for user
      },
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '4h' },
  );

  const refreshToken = jwt.sign(
    { 'email': existingUser.email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' },
  );
  
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 1000,
  });

  res.json({ accessToken });
}

export function refresh(req: Request, res: Response) {
  const cookies = req.cookies;
  // console.log(cookies);

  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const existingUser = await UserModel.findOne({ email: decoded.email }).exec();

      if (!existingUser) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accessToken = jwt.sign(
        {
          'UserInfo': {
            'email': existingUser.email,
            // TODO: define roles for user
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '7m' },
      );

      res.json({ accessToken });
    },
  );

  // return res.json({ msg: 'Hello' });
}

export function logout(req: Request, res: Response) {
  const cookies = req.cookies;
  
  if (!cookies?.jwt) return res.sendStatus(204);
  
  res.clearCookie(
    'jwt', { 
      httpOnly: true, 
      sameSite: 'none', 
      secure: true, 
    });

  res.json({ message: 'Cookie cleared' });
}