import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';
// import otpGenerator from 'otp-generator';
// import crypto from 'crypto';
import { requestPasswordReset, resetPassword, signup } from '../services/authService';

export async function createUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const signupService = await signup(req.body);
  return res.json(signupService);
  
}

export async function getProfile(req: Request, res: Response) {
  try {
    // const user = await UserModel.find({ user: req.user.id });
    res.status(200).json({
      msg: 'profile',
    });
  } catch (err) {
    console.log(err);
  }
}

export function updateProfile(req: Request, res: Response) {
  res.json({
    message: 'update profile', 
  });
}

export function deleteProfile(req: Request, res: Response) {
  res.json({
    message: 'delete profile', 
  });
}

// export async function generateOTP(req: Request, res: Response) {
  
//   const { email } = req.method == 'GET' ? req.query : req.body;

//   const existingUser = await UserModel.findOne({ email });
//   if (!existingUser) {
//     return res.status(404).json('User not found');
//   }
//   req.app.locals.OTP = await otpGenerator.generate(6, {
//     lowerCaseAlphabets: false,
//     upperCaseAlphabets: false,
//     specialChars: false,
//   });

//   res.status(201).json({
//     otp: req.app.locals.OTP,
//   });
// }

export async function resetPasswordRequestController(req: Request, res: Response) {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email,
  );
  
  return res.json(requestPasswordResetService);
}

export async function updatePasswordController(req: Request, res: Response) {
  const resetPasswordService = await resetPassword(
    req.params.userId,
    req.params.token,
    req.body.password,
  );
  console.log(resetPasswordService);
  
  return res.json(resetPasswordService);
}
// export async function verifyOTP(req: Request, res: Response) {
//   const otp: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined  = req.query.otp;
//   console.log(otp);
  
//   if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
//     req.app.locals.OTP = null;
//     req.app.locals.resetSession = true;
//     return res.status(201).json({ message: 'Verification successful' });
//   }

//   return res.status(400).json('Invalid OTP');
// }

// export async function createResetSessionOTP(req: Request, res: Response) {
  
// }