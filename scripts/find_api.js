const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('find /home/groza-bot/ -name api.js', (err, stream) => {
    stream.on('data', d => console.log('STDOUT:', d.toString()));
    stream.on('close', () => conn.end());
    stream.stderr.on('data', d => console.log('ERR:', d.toString()));
  });
}).connect({host: 'ssh-groza-bot.alwaysdata.net', port: 22, username: 'groza-bot', password: '2734010Ab!!))'});
