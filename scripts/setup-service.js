const https = require('https');

const auth = Buffer.from('groza-bot:2734010Ab!!))').toString('base64');
const data = JSON.stringify({
  command: "cd $HOME/www && npm install --production && npm start"
});

const options = {
  hostname: 'api.alwaysdata.com',
  path: '/v1/service/',
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + auth,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Response:', responseData);
    if (res.statusCode === 201) {
      console.log('Background service successfully created!');
    } else {
      console.error('Failed to create background service. Check token validity.');
    }
  });
});

req.on('error', (error) => {
  console.error('API request error:', error);
});

req.write(data);
req.end();
