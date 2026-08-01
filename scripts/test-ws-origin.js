const WebSocket = require('ws');
const ws = new WebSocket('wss://ws1.blitzortung.org/', {
  headers: {
    Origin: 'https://groza-bot.alwaysdata.net'
  }
});
ws.on('open', () => {
  console.log('Connected with Origin header!');
  ws.send(JSON.stringify({a: 111}));
});
ws.on('message', (data) => {
  console.log('Message received:', data.toString().substring(0, 100));
  process.exit(0);
});
ws.on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});
setTimeout(() => {
  console.log('Timeout');
  process.exit(1);
}, 5000);
