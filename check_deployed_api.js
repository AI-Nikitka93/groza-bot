const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /home/groza-bot/www/dist/api.js | grep "/api/user"', (err, stream) => {
    stream.on('data', d => console.log('STDOUT:', d.toString())).on('close', () => conn.end());
    stream.stderr.on('data', d => console.log('ERR:', d.toString()));
  });
}).connect({host: 'ssh-groza-bot.alwaysdata.net', port: 22, username: 'groza-bot', password: '2734010Ab!!))'});
