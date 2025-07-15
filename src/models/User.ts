import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';


const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
