// src/utils/ProgressTracker.js
export default class ProgressTracker {
    constructor(options = {}, io) {
      this.options = options;
      this.tracks = new Map();
      this.io = io; // Socket.io instance
    }
  
    start(progressId) {
      this.tracks.set(progressId, { message: '', percentage: 0 });
      console.log(`Started tracking progress: ${progressId}`);
      this.emitProgress(progressId, 'Tracking started', 0);
    }
  
    send(progressId, message, percentage) {
      if (this.tracks.has(progressId)) {
        this.tracks.set(progressId, { message, percentage });
        console.log(`Progress update for ${progressId}: ${message} - ${percentage}%`);
        this.emitProgress(progressId, message, percentage);
      } else {
        console.warn(`Progress ID ${progressId} not found.`);
      }
    }
  
    end(progressId) {
      if (this.tracks.has(progressId)) {
        this.tracks.delete(progressId);
        console.log(`Ended tracking progress: ${progressId}`);
        this.emitProgress(progressId, 'Tracking ended', 100);
      } else {
        console.warn(`Progress ID ${progressId} not found.`);
      }
    }
  
    cleanup(progressId) {
      if (this.tracks.has(progressId)) {
        this.tracks.delete(progressId);
        console.log(`Cleaned up progress tracking for: ${progressId}`);
        this.emitProgress(progressId, 'Tracking cleaned up', 0);
      }
    }
  
    emitProgress(progressId, message, percentage) {
      if (this.io) {
        this.io.emit('progressUpdate', { id: progressId, message, percentage });
      }
    }
  }
  