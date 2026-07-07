const https = require('https');
const auth = Buffer.from('groza-bot:2734010Ab!!))').toString('base64');
https.get('https://api.alwaysdata.com/v1/site/', {headers: {'Authorization': 'Basic ' + auth}}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log(res.statusCode, body));
});
