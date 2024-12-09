import express from "express"
import sessionRoutes from "./sessionRoutes.js"


const router = express.Router()

if(process.env.NODE_ENV=='development' && process.env.API_TEST=='true'){
  router.use("/api/session", sessionRoutes)

  router.get('/test/progress', async (req, res) => {
  const progressId = `progress-${Date.now()}`;
  req.progress.start(progressId);

  try {
    // Simulate asynchronous progress task
    await simulateAsyncProgress(req.progress, progressId);
    res.send(`Progress completed with ID: ${progressId}`);
  } catch (error) {
    req.progress.send(`Error occurred: ${error.message}`, 100);
    req.progress.end();
    res.status(500).send(`Progress failed with ID: ${progressId}`);
  }
});

function simulateAsyncProgress(progress, progressId) {
  return new Promise((resolve, reject) => {
    let percentage = 0;
    const interval = setInterval(() => {
      percentage += 10;
      if (percentage <= 100) {
        progress.send(`Progress is at ${percentage}%`, percentage);
      }
      if (percentage === 100) {
        progress.end();
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}

}

export default router

