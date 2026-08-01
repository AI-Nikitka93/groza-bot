const { spawn } = require('child_process');

let restartCount = 0;
let lastStartTime = Date.now();

function startProcess() {
    lastStartTime = Date.now();
    console.log(`[WATCHDOG] Starting Groza bot process... (Attempt: ${restartCount + 1})`);
    // Uses test_crash.js instead of dist/index.js
    const child = spawn('node', ['test_crash.js'], { stdio: 'inherit' });

    child.on('close', (code) => {
        const uptime = Date.now() - lastStartTime;
        
        // Replaces the 15-minute recovery timeout with a 3-second timeout
        if (uptime > 3000) {
            console.log(`[WATCHDOG] Process ran for more than 3 seconds. Resetting restart count to 0.`);
            restartCount = 0;
        }

        restartCount++;

        if (restartCount > 5) {
            console.error(`\n[WATCHDOG] CRITICAL ERROR: Crash loop detected! Restart count exceeded 5. Exiting.`);
            process.exit(1);
        }

        const delay = Math.pow(2, restartCount) * 1000;
        console.log(`\n[WATCHDOG] Process exited with code ${code}. Restarting in ${delay / 1000} seconds...`);
        setTimeout(startProcess, delay);
    });
}

startProcess();
