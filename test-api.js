const https = require('https');

function testAuth(username, password) {
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const options = {
    hostname: 'api.alwaysdata.com',
    path: '/v1/service/',
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + auth
    }
  };

  const req = https.request(options, (res) => {
    console.log(`[${username}:${password}] STATUS: ${res.statusCode}`);
  });
  req.on('error', (error) => {
    console.error(`[${username}:${password}] API request error:`, error.message);
  });
  req.end();
}

testAuth('groza-bot', '2734010Ab!!))');
testAuth('2734010Ab!!))', '');
testAuth('groza-bot@alwaysdata.net', '2734010Ab!!))');
