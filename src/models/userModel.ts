import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  resetToken: String;
  resetTokenExpiration: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'],
  },
  email: {
    type: String, required: [true, 'Email is required'], unique: [true, 'Email exists'],
  },
  password: {
    type: String, required: [true, 'Password is required'],
  },
  roles: [{
    type: String,
    default: 'Employee',
  }],
  resetToken: String,
  resetTokenExpiration: Date,
},
{
  timestamps: true,
},
);

UserSchema.pre('save', function (next) {
  const user = this as unknown as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }

  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;
  next();

});

UserSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string,
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;