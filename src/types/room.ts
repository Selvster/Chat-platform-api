
import mongoose, { Document } from 'mongoose';
import { IUser } from './user';

export interface IRoom extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId | IUser;
  members: mongoose.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomServiceResponse {
  room?: IRoom; 
  rooms?: IRoom[]; 
}