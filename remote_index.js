const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const logPath = path.resolve(process.cwd(), 'kill_log.txt');

let logData = '';
function log(msg) {
    console.log(msg);
    logData += `${new Date().toISOString()}: ${msg}\n`;
}

log(`=== Groza Process Killer Started ===`);
log(`Current PID: ${process.pid}`);
log(`Current working directory: ${process.cwd()}`);

try {
    const output = execSync('ps -u groza-bot -o pid,cmd').toString();
    log(`Raw ps output:\n${output}`);
    
    const lines = output.trim().split('\n');
    const killedPids = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const match = line.match(/^(\d+)\s+(.+)$/);
        if (!match) continue;
        
        const pid = parseInt(match[1], 10);
        const cmd = match[2];
        
        if (cmd.includes('node') && pid !== process.pid) {
            log(`Target found: PID ${pid} -> ${cmd}`);
            try {
                process.kill(pid, 'SIGKILL');
                log(`  Sent process.kill SIGKILL to ${pid}`);
                killedPids.push(pid);
            } catch (err) {
                log(`  process.kill failed for ${pid}: ${err.message}. Trying kill -9...`);
                try {
                    execSync(`kill -9 ${pid}`);
                    log(`  Executed kill -9 ${pid} successfully`);
                    killedPids.push(pid);
                } catch (err2) {
                    log(`  kill -9 failed for ${pid}: ${err2.message}`);
                }
            }
        }
    }
    
    log(`Killed processes count: ${killedPids.length}. PIDs: ${killedPids.join(', ')}`);
} catch (err) {
    log(`Error during process killing: ${err.message}\n${err.stack}`);
}

try {
    fs.writeFileSync(logPath, logData);
    console.log(`Saved log to ${logPath}`);
} catch (e) {
    console.error(`Failed to write log file: ${e.message}`);
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = http.createServer((req, res) => {
    log(`Received request: ${req.method} ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    
    let currentLog = '';
    try {
        currentLog = fs.readFileSync(logPath, 'utf8');
    } catch (e) {
        currentLog = `Could not read log file: ${e.message}\nIn-memory log:\n${logData}`;
    }
    
    res.end(`Groza Process Killer execution report:\n\n${currentLog}`);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Killer HTTP server listening on port ${PORT}`);
});
