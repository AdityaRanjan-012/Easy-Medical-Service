import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { Server } from 'socket.io';
import http from 'http';
import './config/passport.js'; 

import authRoutes from './routes/authRoutes.js';
import ambulanceRoutes from './routes/ambulanceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


app.get('/', (req, res) => {
  res.send('Welcome to Ranjan Medical Service');
});
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}
console.log(mongoUri);

mongoose.connect(mongoUri, {
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRoutes);
app.use('/auth', authRoutes);
app.use('/ambulance', ambulanceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/hospitals', hospitalRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('notify', (data) => {
    io.emit('notification', data);
  });
  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
