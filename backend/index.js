import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import actionRoutes from './src/routes/actionRoutes.js';
import cors from 'cors';
import { connectDB } from './src/lib/db.js';
import { createServer } from 'http';
import { initializeSocket } from './src/lib/socket.js';
import path from 'path';

const __dirname=path.resolve();


const app = express(); 
const server = createServer(app);

initializeSocket(server);


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/action", actionRoutes);



app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 3000;


if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get('/{*any}',(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  })
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});    