const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection Established.');
  conn.exec("tail -n 50 ~/nohup.out", (err, stream) => {
    if (err) throw err;
    let stdout = '';
    let stderr = '';
    stream.on('close', (code, signal) => {
      console.log('================ STDOUT ================');
      console.log(stdout);
      console.log('================ STDERR ================');
      console.log(stderr);
      conn.end();
    }).on('data', (data) => {
      stdout += data;
    }).stderr.on('data', (data) => {
      stderr += data;
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
