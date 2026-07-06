const WebSocket = require('ws');
const ws = new WebSocket('wss://ws1.blitzortung.org/');

ws.on('open', () => {
    console.log('Connected');
    ws.send(JSON.stringify({a: 111}));
});

ws.on('message', (data) => {
    console.log('Message:', data.toString());
    ws.close();
});

ws.on('error', (err) => {
    console.error('Error:', err);
});
