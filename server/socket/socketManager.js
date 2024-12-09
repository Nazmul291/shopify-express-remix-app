// src/socket/SocketManager.js
import { Server } from 'socket.io';

class SocketManager {
  constructor() {
    if (!SocketManager.instance) {
      this.io = null;
      SocketManager.instance = this;
    }

    return SocketManager.instance;
  }

  initialize(server, options = {}) {
    if (!this.io) {
      this.io = new Server(server, options);
      this.io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('disconnect', () => {
          console.log(`Client disconnected: ${socket.id}`);
        });
      });
    }
    return this.io;
  }

  getIO() {
    if (!this.io) {
      throw new Error('Socket.io not initialized!');
    }
    return this.io;
  }
}

const instance = new SocketManager();
// Object.freeze(instance);

export default instance;
