const { spawn } = require('child_process');

let restartCount = 0;
let lastStartTime = Date.now();

function startProcess() {
    lastStartTime = Date.now();
    console.log(`[WATCHDOG] Starting Groza bot process... (Attempt: ${restartCount + 1})`);
    const child = spawn('node', ['test_crash.js'], { stdio: 'inherit' });

    child.on('close', (code) => {
        const uptime = Date.now() - lastStartTime;
        
        if (uptime > 60000) {
            console.log(`[WATCHDOG] Process ran for more than 60 seconds. Resetting restart count to 0.`);
            restartCount = 0;
        }

        restartCount++;

        if (restartCount > 5) {
            console.error(`\n[STATE] RECOVERY_ATTEMPT Entering 5-second recovery mode...`);
            setTimeout(() => {
                restartCount = 0;
                startProcess();
            }, 5 * 1000);
            return;
        }

        const delay = 100; // Fast for testing
        console.log(`\n[WATCHDOG] Process exited with code ${code}. Restarting in ${delay / 1000} seconds...`);
        setTimeout(startProcess, delay);
    });
}

startProcess();
