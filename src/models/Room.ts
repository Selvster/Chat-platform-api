import mongoose, { Schema } from 'mongoose';
import { IRoom } from '../types';


const RoomSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, 
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
}, {
  timestamps: true, 
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
