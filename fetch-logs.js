const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection Established.');
  conn.exec('ls -la ~/admin/logs/sites/ && echo "---" && ls -la ~/admin/logs/uwsgi/', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: \n' + data);
    }).stderr.on('data', (data) => {
      console.error('STDERR: \n' + data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect({
  host: 'ssh-groza-bot.alwaysdata.net',
  port: 22,
  username: 'groza-bot',
  password: '2734010Ab!!))'
});
