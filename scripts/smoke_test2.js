const https = require('https');
https.get('https://groza-bot.alwaysdata.net/', (res) => {
  console.log('WebApp:', res.statusCode);
});
https.get('https://groza-bot.alwaysdata.net/api/debug-db', (res) => {
  let data = '';
  res.on('data', c => data+=c);
  res.on('end', () => console.log('DB Debug:', data));
});
