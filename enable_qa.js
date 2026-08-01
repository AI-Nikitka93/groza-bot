const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('grep -q "QA_MODE=true" /home/groza-bot/www/.env || echo "QA_MODE=true" >> /home/groza-bot/www/.env && touch /home/groza-bot/www/tmp/restart.txt', (err, stream) => {
    stream.on('data', d => console.log(d.toString())).on('close', () => { console.log('Enabled QA_MODE'); conn.end(); });
  });
}).connect({ host: 'ssh-groza-bot.alwaysdata.net', username: 'groza-bot', password: '2734010Ab!!))' });
