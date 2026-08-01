const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const ftpConfig = {
    host: "ftp-groza-bot.alwaysdata.net",
    user: "groza-bot",
    password: "2734010Ab!!))",
    secure: true,
    secureOptions: { rejectUnauthorized: false }
};

const killerCode = `const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const logPath = path.resolve(process.cwd(), 'kill_log.txt');

let logData = '';
function log(msg) {
    console.log(msg);
    logData += \`\${new Date().toISOString()}: \${msg}\\n\`;
}

log(\`=== Groza Process Killer Started ===\`);
log(\`Current PID: \${process.pid}\`);
log(\`Current working directory: \${process.cwd()}\`);

try {
    const output = execSync('ps -u groza-bot -o pid,cmd').toString();
    log(\`Raw ps output:\\n\${output}\`);
    
    const lines = output.trim().split('\\n');
    const killedPids = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const match = line.match(/^(\\d+)\\s+(.+)$/);
        if (!match) continue;
        
        const pid = parseInt(match[1], 10);
        const cmd = match[2];
        
        if (cmd.includes('node') && pid !== process.pid) {
            log(\`Target found: PID \${pid} -> \${cmd}\`);
            try {
                process.kill(pid, 'SIGKILL');
                log(\`  Sent process.kill SIGKILL to \${pid}\`);
                killedPids.push(pid);
            } catch (err) {
                log(\`  process.kill failed for \${pid}: \${err.message}. Trying kill -9...\`);
                try {
                    execSync(\`kill -9 \${pid}\`);
                    log(\`  Executed kill -9 \${pid} successfully\`);
                    killedPids.push(pid);
                } catch (err2) {
                    log(\`  kill -9 failed for \${pid}: \${err2.message}\`);
                }
            }
        }
    }
    
    log(\`Killed processes count: \${killedPids.length}. PIDs: \${killedPids.join(', ')}\`);
} catch (err) {
    log(\`Error during process killing: \${err.message}\\n\${err.stack}\`);
}

try {
    fs.writeFileSync(logPath, logData);
    console.log(\`Saved log to \${logPath}\`);
} catch (e) {
    console.error(\`Failed to write log file: \${e.message}\`);
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = http.createServer((req, res) => {
    log(\`Received request: \${req.method} \${req.url}\`);
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    
    let currentLog = '';
    try {
        currentLog = fs.readFileSync(logPath, 'utf8');
    } catch (e) {
        currentLog = \`Could not read log file: \${e.message}\\nIn-memory log:\\n\${logData}\`;
    }
    
    res.end(\`Groza Process Killer execution report:\\n\\n\${currentLog}\`);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(\`Killer HTTP server listening on port \${PORT}\`);
});
`;

async function run() {
    const indexPath = path.join(__dirname, 'dist', 'index.js');
    const indexBakPath = path.join(__dirname, 'dist', 'index.js.bak');
    
    console.log("Step 1: Backup local dist/index.js...");
    if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, indexBakPath);
        console.log("Local dist/index.js backed up to dist/index.js.bak");
    }
    
    console.log("Step 2: Write temporary dist/index.js with killer code...");
    fs.writeFileSync(indexPath, killerCode);
    
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
        console.log("Connecting to Alwaysdata FTP...");
        await client.access(ftpConfig);
        console.log("Connected.");
        
        console.log("Step 3: Delete existing kill_log.txt on server...");
        try {
            await client.remove("www/kill_log.txt");
        } catch (e) {}
        
        console.log("Step 4: Uploading temporary dist/index.js to server...");
        await client.uploadFrom(indexPath, "www/dist/index.js");
        
        console.log("Step 5: Touching restart.txt on server to trigger Passenger reload...");
        // Touch in www/tmp
        fs.writeFileSync("restart.txt", Date.now().toString());
        
        try {
            await client.cd("www");
            await client.ensureDir("tmp");
            await client.uploadFrom("restart.txt", "restart.txt");
            console.log("Touched www/tmp/restart.txt");
            await client.cd(".."); // back to root
        } catch(e) { console.error("Failed touching www/tmp/restart.txt", e.message); }

        // Touch in www/dist/tmp
        try {
            await client.cd("www");
            await client.cd("dist");
            await client.ensureDir("tmp");
            await client.uploadFrom(path.join(process.cwd(), "restart.txt"), "restart.txt");
            console.log("Touched www/dist/tmp/restart.txt");
        } catch(e) { console.error("Failed touching www/dist/tmp/restart.txt", e.message); }
        
        fs.unlinkSync("restart.txt");
        
        console.log("Step 6: Making HTTP request to trigger the script...");
        client.close();
        
        // Let's make multiple requests to ensure it hits a new worker
        for (let i = 0; i < 5; i++) {
            await sleep(2000);
            const targetUrl = 'https://groza-bot.alwaysdata.net/api/monitoring/stats';
            console.log(`Fetching ${targetUrl} (Attempt ${i + 1})...`);
            try {
                const https = require('https');
                const responseText = await new Promise((resolve, reject) => {
                    https.get(targetUrl, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => resolve({status: res.statusCode, body: data}));
                    }).on('error', reject);
                });
                console.log(`Status: ${responseText.status}, Body preview: ${responseText.body.substring(0, 50)}...`);
                if (responseText.body.includes('Groza Process Killer')) {
                    console.log("KILLER SCRIPT EXECUTED SUCCESSFULLY!");
                    break;
                }
            } catch (e) {
                console.log("HTTP error:", e.message);
            }
        }
        
    } catch (err) {
        console.error("FTP/Process error:", err);
        if (client) client.close();
    } finally {
        console.log("Step 7: Restoring original local dist/index.js if backup exists...");
        if (fs.existsSync(indexBakPath)) {
            fs.copyFileSync(indexBakPath, indexPath);
            fs.unlinkSync(indexBakPath);
        }
        console.log("Step 8: Uploading correct dist/index.js to FTP...");
        try {
            const client3 = new ftp.Client();
            await client3.access(ftpConfig);
            await client3.uploadFrom(indexPath, "www/dist/index.js");
            console.log("Correct dist/index.js uploaded to FTP.");
            
            // Touch restart.txt again to restart with the correct code
            fs.writeFileSync("restart.txt", Date.now().toString());
            try {
                await client3.cd("www");
                await client3.ensureDir("tmp");
                await client3.uploadFrom("restart.txt", "restart.txt");
                await client3.cd("..");
                await client3.cd("www/dist");
                await client3.ensureDir("tmp");
                await client3.uploadFrom(path.join(process.cwd(), "restart.txt"), "restart.txt");
            } catch(e) {}
            fs.unlinkSync("restart.txt");
            client3.close();
        } catch(e) {
            console.log("Error restoring on FTP:", e);
        }
    }
}
run();
