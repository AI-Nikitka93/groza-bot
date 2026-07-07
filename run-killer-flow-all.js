const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

const ftpConfig = {
    host: "ftp-groza-bot.alwaysdata.net",
    user: "groza-bot",
    password: "2734010Ab!!))",
    secure: true,
    secureOptions: { rejectUnauthorized: false }
};

const killerCode = `
const { execSync } = require('child_process');
const http = require('http');

console.log('=== Groza Process Killer Started ===');
try {
    const output = execSync('ps -u groza-bot -o pid,cmd').toString();
    const lines = output.trim().split('\\n');
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const match = line.match(/^(\\d+)\\s+(.+)$/);
        if (!match) continue;
        const pid = parseInt(match[1], 10);
        const cmd = match[2];
        if (cmd.includes('node') && pid !== process.pid) {
            try { process.kill(pid, 'SIGKILL'); } catch (err) {}
            try { execSync('kill -9 ' + pid); } catch (err2) {}
        }
    }
} catch (err) {}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Groza Process Killer execution report');
});
server.listen(PORT, '0.0.0.0', () => {});
`;

async function run() {
    const indexPath = path.join(__dirname, 'dist', 'index.js');
    fs.writeFileSync(indexPath, killerCode);
    fs.writeFileSync('restart.txt', Date.now().toString());

    const client = new ftp.Client();
    try {
        await client.access(ftpConfig);
        await client.uploadFrom(indexPath, "www/dist/index.js");
        
        const pathsToTouch = [
            'www/tmp',
            'www/dist/tmp',
            'www',
            'tmp',
            '/'
        ];

        for (const p of pathsToTouch) {
            try {
                if (p !== '/') {
                    try { await client.ensureDir(p); } catch(e){}
                    await client.cd('/' + p);
                } else {
                    await client.cd('/');
                }
                await client.uploadFrom('restart.txt', 'restart.txt');
                console.log('Touched ' + p + '/restart.txt');
            } catch (e) {
                console.log('Failed ' + p + '/restart.txt: ' + e.message);
            }
        }

        client.close();

        for (let i = 0; i < 5; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const targetUrl = 'https://groza-bot.alwaysdata.net/api/monitoring/stats';
            console.log('Fetching ' + targetUrl + ' (Attempt ' + (i + 1) + ')...');
            try {
                const https = require('https');
                const responseText = await new Promise((resolve, reject) => {
                    https.get(targetUrl, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => resolve({status: res.statusCode, body: data}));
                    }).on('error', reject);
                });
                console.log('Status: ' + responseText.status + ', Body: ' + responseText.body.substring(0, 50));
            } catch (e) {
                console.log("HTTP error:", e.message);
            }
        }
    } catch (err) {
        console.error("Error:", err);
    }
}
run();
