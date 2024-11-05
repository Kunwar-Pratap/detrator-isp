import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import db from './db';
import dotenv from 'dotenv';
import cors from "cors";
import type { OkPacket } from 'mysql2';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for Express

app.use(cors({
  origin: "http://localhost:3000",  //frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));

// Enable JSON parsing middleware
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http:localhost:3000", //frontend URL
    methods: ["GET", "POST"],
  }
});

// Endpoint to login (generate a session ID)
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    res.json({ sessionId: `session-${username}` });
  }
  else {
    res.status(400).json({ error: 'Username is required!' });
  }
});

// Fetch all comments Endpoint
app.get('/api/comments', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM comments ORDER BY timestamp DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error occurred!' });
  }
});

// Post a new comment and broadcasting
app.post('/api/comments', async (req, res) => {
  const { username, comment } = req.body;

  try {
    const [result] = await db.query<OkPacket>('INSERT INTO comments (username, comment) VALUES (?, ?)', [username, comment]);
    const newComment = { id: result.insertId, username, comment, timestamp: new Date() };
    io.emit("new-comment", newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment due to some technical issues!' });
  }
});

io.on("connection", (socket) => {
  console.log("New user connected...");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));