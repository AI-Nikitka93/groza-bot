const { Client } = require('ssh2');
const fs = require('fs');

console.log('Starting deployment to Alwaysdata...');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection Established.');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading bot.zip...');
    const readStream = fs.createReadStream('bot.zip');
    const writeStream = sftp.createWriteStream('/home/groza-bot/www/bot.zip');
    
    writeStream.on('close', () => {
      console.log('Upload complete. Unzipping...');
      // Unzip and clean up
      conn.exec('cd /home/groza-bot/www && unzip -o bot.zip && rm bot.zip', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Extraction complete with code ' + code);
          conn.end();
        }).on('data', (data) => {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          console.error('STDERR: ' + data);
        });
      });
    });
    readStream.pipe(writeStream);
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect({
  host: 'ssh-groza-bot.alwaysdata.net',
  port: 22,
  username: 'groza-bot',
  password: '2734010Ab!!))'
});
