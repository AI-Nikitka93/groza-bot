const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("alwaysdata service list || cat ~/.alwaysdata_token || env | grep -i token || ls -la ~/.alwaysdata*", (err, stream) => {
    if (err) throw err;
    let stdout = '';
    let stderr = '';
    stream.on('close', (code, signal) => {
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      conn.end();
    }).on('data', (data) => stdout += data)
      .stderr.on('data', (data) => stderr += data);
  });
}).connect({
  host: 'ssh-groza-bot.alwaysdata.net',
  port: 22,
  username: 'groza-bot',
  password: '2734010Ab!!))'
});
