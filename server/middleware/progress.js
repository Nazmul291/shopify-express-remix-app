// src/middleware/ProgressMiddleware.js
import ProgressTracker from '../utility/progressTracker.js';
import SocketManager from '../socket/socketManager.js';

class ProgressMiddleware {
  constructor(options = {}) {
    const io = SocketManager.getIO();
    this.tracker = new ProgressTracker(options, io);
  }

  middleware() {
    return (req, res, next) => {
      let progressId; // To store the current progress ID

      // Attach progress methods to the request object
      req.progress = {
        start: (id) => {
          progressId = id;
          this.tracker.start(id);
        },
        send: (message, percentage) => {
          if (progressId) {
            this.tracker.send(progressId, message, percentage);
          } else {
            console.warn('Progress ID not set. Call req.progress.start(progressId) first.');
          }
        },
        end: () => {
          if (progressId) {
            this.tracker.end(progressId);
          } else {
            console.warn('Progress ID not set. Call req.progress.start(progressId) first.');
          }
        },
      };

      // Optional: Listen for 'progress' events on the request (if needed)
      req.on('progress', (data) => {
        // Handle progress updates in your application logic here
        console.log(`Progress update for ${data.id}: ${data.message} - ${data.percentage}%`);
      });

      next();
    };
  }
}

export default function progressMiddleware(options = {}) {
    const progress = new ProgressMiddleware(options);
    return progress.middleware();
}

// Example usase 
// req.progress.start(progressId);
// res.send(`Progress completed with ID: ${progressId}`);
// req.progress.send(`Error occurred: ${error.message}`, 100);
// req.progress.end();