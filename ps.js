const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('ps x', (err, stream) => {
    stream.on('data', data => console.log(data.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: 'ssh-groza-bot.alwaysdata.net', port: 22,
  username: 'groza-bot', password: '2734010Ab!!))'
});
