const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('tail -n 100 /home/groza-bot/admin/logs/sites/2026/sites-2026-07-21.log', (err, stream) => {
    stream.on('data', d => console.log(d.toString())).on('close', () => conn.end());
  });
}).connect({ host: 'ssh-groza-bot.alwaysdata.net', username: 'groza-bot', password: '2734010Ab!!))' });
