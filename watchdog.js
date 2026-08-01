const { spawn } = require('child_process');

let restartCount = 0;
let lastStartTime = Date.now();
let lastCrashTime = null;
let crashHistory = [];
let crashReason = null;
let watchdogState = 'RUNNING';
let childProcess = null;

// Graceful shutdown forwarding
['SIGTERM', 'SIGINT'].forEach(sig => {
    process.on(sig, () => {
        console.log(`[WATCHDOG] Received ${sig}, forwarding to child...`);
        if (childProcess) childProcess.kill(sig);
        process.exit(0);
    });
});

function startProcess() {
    // Kill any existing orphaned Node processes except this watchdog
    try {
        const execSync = require('child_process').execSync;
        const pids = execSync('pgrep node').toString().trim().split('\\n');
        const myPid = process.pid.toString();
        for (let pid of pids) {
            if (pid && pid !== myPid) {
                console.log(`[WATCHDOG] Killing orphaned process ${pid}`);
                try { process.kill(parseInt(pid, 10), 'SIGKILL'); } catch (e) {}
            }
        }
    } catch(e) {}

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
    childProcess = spawn('node', ['--max-old-space-size=512', 'dist/index.js'], {
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

    childProcess.on('close', (code) => {
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
