const ftp = require("basic-ftp");
const { Client } = require('ssh2');

async function deploy() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp-groza-bot.alwaysdata.net",
            user: "groza-bot",
            password: "2734010Ab!!))",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        
        await client.cd("www");
        console.log("Uploading dist folder...");
        await client.uploadDir("dist", "dist");
        console.log("Uploading package.json and watchdog.js...");
        await client.uploadFrom("package.json", "package.json");
        await client.uploadFrom("watchdog.js", "watchdog.js");
        console.log("FTP Upload complete!");
        
        console.log("Creating tmp/restart.txt to restart passenger via FTP...");
        require('fs').writeFileSync('restart.txt', '');
        await client.cd('tmp').catch(async (e) => {
            await client.cd('..'); // go back to root
            await client.cd('www');
            await client.ensureDir('tmp');
            await client.cd('tmp');
        });
        await client.uploadFrom('restart.txt', 'restart.txt');
        console.log("Passenger restart triggered.");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

deploy();
