import crypto from 'crypto';
import bcrypt from 'bcrypt';

import tokenModel from '../models/tokenModel';
import UserModel from '../models/userModel';
import { sendPasswordResetEmail } from '../utils/email/sendEmail';

export const signup = async (userInfo: any) => {
  try {
    const { name, email, password } = userInfo;

    const duplicate = await UserModel.findOne({ email }).lean().exec();

    if (duplicate) {
      return { message: 'Duplicate user' };
    }
    
    const userObject = { name, email, password };

    const user = await UserModel.create(userObject);
  
    if (user) {
      return { message: `New user ${email} created` };
    }
  } catch (error: any) {
    return error.message;
  } 
}; 

export const requestPasswordReset = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Email does not exist');

    let token = await tokenModel.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);

    await new tokenModel({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.clientURL}/resetPassword/?token=${resetToken}&userId=${user._id}`;

    const emailResponse = await sendPasswordResetEmail(
      user.email,
      'Password Reset Request',
      {
        name: user.name,
        link: link,
      },
    );

    if (emailResponse) {
      return { link };
    }
    
  } catch (error) {
    return error;
  }
};


export const resetPassword = async (userId: unknown, token: string, password: string) => {
  try {
    let passwordResetToken = await tokenModel.findOne({ userId });

    if (!passwordResetToken) {
      throw new Error('Invalid or expired password reset token');
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      throw new Error('Invalid or expired password reset token');
    }

    const hash = await bcrypt.hash(password, 10);

    const updateResponse = await UserModel.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true },
    );

    const deleteToken = await passwordResetToken.deleteOne();

    if (updateResponse || deleteToken) {
      return { message: 'Password reset was successful' };
    } else {
      return { message: 'There is an error with storing the new password' } ;
    }

  } catch (error) {
    return error;    
  }
  
};
