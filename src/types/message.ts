import mongoose, { Document, Schema } from 'mongoose';
export interface IMessage extends Document {
  room: mongoose.Schema.Types.ObjectId; 
  content: string; 
  createdAt: Date;
  updatedAt: Date;
}
export interface MessageServiceResponse {
  message?: IMessage; 
  messages?: IMessage[]; 
}