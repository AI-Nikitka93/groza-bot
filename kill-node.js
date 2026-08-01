const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('kill -9 $(pgrep -f dist/index.js)', (err, stream) => {
    stream.on('data', data => console.log(data.toString()));
    stream.stderr.on('data', data => console.error(data.toString()));
    stream.on('close', () => {
       console.log('Killed by kill -9 pgrep.');
       conn.end();
    });
  });
}).connect({
  host: 'ssh-groza-bot.alwaysdata.net', port: 22,
  username: 'groza-bot', password: '2734010Ab!!))'
});
