const { Worker } = require('worker_threads');

let startTime = Date.now();

// Live counter that runs every 100ms
const interval = setInterval(() => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  process.stdout.write(`\rRunning for ${elapsed} seconds...`);
}, 100);

// Start the worker / exploit poc
const worker = new Worker('./exploit.js');

worker.on('message', () => {
  clearInterval(interval);
  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\nFunction completed in ${totalElapsed} seconds.`);
});
