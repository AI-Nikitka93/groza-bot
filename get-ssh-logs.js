const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /home/groza-bot/www && node dist/index.js', (err, stream) => {
    if (err) throw err;
    let output = '';
    stream.on('close', (code, signal) => {
      console.log(output);
      conn.end();
    }).on('data', (data) => {
      output += data.toString();
    }).stderr.on('data', (data) => {
      output += data.toString();
    });
    
    // Stop after 3 seconds to avoid hanging
    setTimeout(() => {
      console.log('Timeout. Output:', output);
      conn.end();
    }, 3000);
  });
}).connect({
  host: 'ssh-groza-bot.alwaysdata.net',
  port: 22,
  username: 'groza-bot',
  password: '2734010Ab!!))'
});
