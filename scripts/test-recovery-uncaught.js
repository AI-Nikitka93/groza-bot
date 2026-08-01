process.on('uncaughtException', (err) => {
  console.error('[SUCCESS] Uncaught Exception caught by handler:', err.message);
  process.exit(0);
});

console.log('Simulating Node.js crash...');
setTimeout(() => {
    throw new Error('Test Crash');
}, 100);
