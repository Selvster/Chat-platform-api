import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import roomRoutes from './routes/room';
import cookieParser from 'cookie-parser'; 
import errorHandler from './middlewares/errorHandler'; 
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.FRONTEND_URL ,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Chat Backend API is running!');
});

app.use('/api/auth', authRoutes);

app.use('/api/rooms', roomRoutes); 


app.use(errorHandler);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});