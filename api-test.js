const https = require('https');

const tokens = [
  'groza-bot:2734010Ab!!))',
  '2734010Ab!!)):',
  '2734010Ab!!)) account=groza-bot:',
  '2734010Ab!!)) account=groza-bot',
  'groza-bot:2734010Ab!!)) account=groza-bot'
];

async function testToken(tokenStr) {
  return new Promise((resolve) => {
    const auth = Buffer.from(tokenStr).toString('base64');
    https.get('https://api.alwaysdata.com/v1/site/', {headers: {'Authorization': 'Basic ' + auth}}, res => {
      resolve({token: tokenStr, status: res.statusCode});
    }).on('error', () => resolve({token: tokenStr, status: 'error'}));
  });
}

async function run() {
  for (const t of tokens) {
    const res = await testToken(t);
    console.log(`Token: ${res.token} => Status: ${res.status}`);
  }
}
run();
