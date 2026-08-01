const https = require('https');

const auth = Buffer.from('groza-bot:2734010Ab!!))').toString('base64');

const options = {
  hostname: 'api.alwaysdata.com',
  path: '/v1/site/',
  method: 'GET',
  headers: {
    'Authorization': 'Basic ' + auth
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const sites = JSON.parse(data);
      console.log('Sites found:', sites.length);
      if (sites.length > 0) {
        const site = sites.find(s => JSON.stringify(s).includes('groza-bot')) || sites[0];
        console.log('Target Site:', site);
        const siteId = site.id || site.href?.split('/').filter(Boolean).pop();
        console.log('Site ID is:', siteId);
        
        // Restart site
        if (siteId) {
            const restartOptions = {
                hostname: 'api.alwaysdata.com',
                path: `/v1/site/${siteId}/restart/`,
                method: 'POST',
                headers: {
                  'Authorization': 'Basic ' + auth
                }
            };
            const restartReq = https.request(restartOptions, (restartRes) => {
                console.log('Restart status:', restartRes.statusCode);
                restartRes.on('data', d => process.stdout.write(d));
            });
            restartReq.on('error', e => console.error(e));
            restartReq.end();
        }
      }
    } catch(e) {
      console.error('Error parsing JSON:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('API request error:', e);
});

req.end();
