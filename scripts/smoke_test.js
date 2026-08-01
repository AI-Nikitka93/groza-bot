const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function smokeTest() {
  try {
    const health = await fetch('https://groza-bot.alwaysdata.net/health');
    console.log('Health:', health.status, health.data);
    
    const ready = await fetch('https://groza-bot.alwaysdata.net/ready');
    console.log('Ready:', ready.status, ready.data);
  } catch(e) {
    console.error('Smoke test failed:', e.message);
  }
}
smokeTest();
