const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('ls -laR /home/groza-bot/admin/logs', (err, stream) => {
    stream.on('data', d => console.log(d.toString())).on('close', () => conn.end());
  });
}).connect({ host: 'ssh-groza-bot.alwaysdata.net', username: 'groza-bot', password: '2734010Ab!!))' });
