const { Client } = require('@simonschick/blitzortungapi');
const WebSocket = require('ws');
const client = new Client({ make: (url) => new WebSocket(url) });

client.on('connect', () => {
    console.log('Connected!');
});

client.on('data', (data) => {
    console.log('Strike received:', data);
    process.exit(0);
});

client.on('error', (err) => {
    console.error('Error:', err);
    process.exit(1);
});

client.connect();
