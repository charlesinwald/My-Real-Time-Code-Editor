import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

let currentHtmlCode = '';
let currentCssCode = '';

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('currentState', { htmlCode: currentHtmlCode, cssCode: currentCssCode });

    socket.on('htmlCodeUpdate', (code) => {
      currentHtmlCode = code;
      socket.broadcast.emit('htmlCodeUpdate', code);
    });

    socket.on('cssCodeUpdate', (code) => {
      currentCssCode = code;
      socket.broadcast.emit('cssCodeUpdate', code);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
