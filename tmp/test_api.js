const https = require('https');
https.get('https://groza-bot.alwaysdata.net/api/strikes', (res) => {
  let data = '';
  res.on('data', c => data+=c);
  res.on('end', () => console.log('Strikes API:', data.substring(0, 500)));
});
