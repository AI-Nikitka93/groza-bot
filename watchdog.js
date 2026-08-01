const { spawn } = require('child_process');

let restartCount = 0;
let lastStartTime = Date.now();
let lastCrashTime = null;
let crashHistory = [];
let crashReason = null;
let watchdogState = 'RUNNING';

function startProcess() {
    lastStartTime = Date.now();
    watchdogState = 'RUNNING';
    
    // Average restart time calc
    let avgRestartMs = 0;
    if (crashHistory.length > 1) {
        let diffs = [];
        for (let i = 1; i < crashHistory.length; i++) {
            diffs.push(crashHistory[i] - crashHistory[i-1]);
        }
        avgRestartMs = diffs.reduce((a,b)=>a+b,0) / diffs.length;
    }

    console.log(`[STATE] RUNNING Starting Groza bot process... (Attempt: ${restartCount + 1})`);
    const child = spawn('node', ['--max-old-space-size=512', 'dist/index.js'], {
        stdio: 'inherit',
        env: {
            ...process.env,
            RESTART_COUNT: restartCount,
            LAST_CRASH: lastCrashTime ? new Date(lastCrashTime).toISOString() : '',
            CRASH_REASON: crashReason || '',
            WATCHDOG_STATE: watchdogState,
            AVG_RESTART_TIME_MS: avgRestartMs
        }
    });

    child.on('close', (code) => {
        const uptime = Date.now() - lastStartTime;
        lastCrashTime = Date.now();
        crashReason = `Exit code ${code}`;
        crashHistory.push(lastCrashTime);
        if (crashHistory.length > 10) crashHistory.shift();
        
        if (uptime > 30000) {
            console.log(`[STATE] RUNNING Process ran for more than 30 seconds. Resetting restart count to 0.`);
            restartCount = 0;
        }

        restartCount++;

        watchdogState = 'BACKOFF';
        const delay = Math.min(60000, Math.pow(2, restartCount) * 1000);
        console.log(`\n[STATE] RESTARTING Process exited with code ${code}.`);
        console.log(`[STATE] BACKOFF Restarting in ${delay / 1000} seconds...`);
        setTimeout(startProcess, delay);
    });
}

startProcess();
