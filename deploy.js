const { Client } = require('ssh2');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });
console.log('Zipping files...');
try { execSync('del bot.zip', { stdio: 'ignore' }); } catch(e){}
execSync('npx bestzip bot.zip dist package.json package-lock.json public config.json watchdog.js', { stdio: 'inherit' });

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
      // Unzip, check .env, and clean up
      const script = `
        cd /home/groza-bot/www && 
        unzip -o bot.zip && 
        rm bot.zip && 
        mkdir -p tmp && 
        node -e "
          require('dotenv').config();
          const req = ['TELEGRAM_BOT_TOKEN', 'DATABASE_URL', 'REDIS_URL'];
          const missing = req.filter(k => !process.env[k]);
          if(missing.length > 0) {
            console.error('PREFLIGHT FAILED: Missing vars: ' + missing.join(', '));
            process.exit(1);
          }
          console.log('PREFLIGHT SUCCESS: All vars present.');
        " && 
        npm install --omit=dev &&
        touch tmp/restart.txt
      `;
      conn.exec(script, (err, stream) => {
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
  password: process.env.DEPLOY_PASSWORD
});
