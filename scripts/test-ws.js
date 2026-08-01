const WebSocket = require('ws');
const ws = new WebSocket('wss://ws1.blitzortung.org/');
ws.on('open', () => {
  ws.send(JSON.stringify({time: 0}));
});
ws.on('message', (data) => {
  console.log('Raw:', data.toString().substring(0, 50));
  try {
    const parsed = JSON.parse(data);
    console.log('Parsed:', parsed.lat, parsed.lon);
  } catch (e) {
    console.log('Error parsing JSON:', e.message);
  }
  process.exit(0);
});
