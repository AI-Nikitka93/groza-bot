const { Client } = require('@simonschick/blitzortungapi');
const WebSocket = require('ws');

const client = new Client({
  make: url => new WebSocket(url)
});

let strikes = 0;
client.on('connect', () => console.log('Connected API!'));
client.on('data', strike => strikes++);
client.connect();

const ws2 = new WebSocket('wss://ws1.blitzortung.org/');
let rawStrikes = 0;
ws2.on('open', () => {
    console.log('Connected RAW!');
    ws2.send(JSON.stringify({ a: 111 }));
});
ws2.on('message', () => rawStrikes++);

setTimeout(() => {
  console.log('Strikes in 5s (API):', strikes);
  console.log('Strikes in 5s (RAW):', rawStrikes);
  process.exit(0);
}, 5000);
