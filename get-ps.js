const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('ps aux | grep node', (err, stream) => {
    stream.on('data', data => process.stdout.write(data.toString()));
    stream.stderr.on('data', data => process.stderr.write(data.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: 'ssh-groza-bot.alwaysdata.net', port: 22,
  username: 'groza-bot', password: '2734010Ab!!))'
});
