
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('video'), (req, res) => {
  const videoPath = `/uploads/${req.file.filename}`;
  io.emit('new-video', videoPath);
  res.json({ videoPath });
});

io.on('connection', socket => {
  console.log('🟢 Usuario conectado');

  socket.on('chat-message', ({ user, message }) => {
    io.emit('chat-message', `${user}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Usuario desconectado');
  });
});

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
server.listen(3000, () => {
  console.log('Servidor listo en http://localhost:3000');
});
