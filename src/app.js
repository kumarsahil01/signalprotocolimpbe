// this initalize the app entry 
import express from 'express'
import cors from 'cors'
import morgan from 'morgan' //this is used for  enviroment setup
import dotenv from 'dotenv'

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import keyRoutes from './routes/keyRoutes.js'
import deviceRoutes from './routes/deviceRoutes.js'

dotenv.config();
const app =express();

//middlewares 
app.use(cors());
app.use(express.json())
app.use(morgan("dev"))


// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/keys', keyRoutes);
app.use('/api/devices',deviceRoutes)

// app.use('/api/messages', messageRoutes);


app.get('/', (req, res) => {
  res.send('✅ Signal Protocol Backend API is running...');
});

export default app;