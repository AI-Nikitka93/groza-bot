const ftp = require("basic-ftp");
const fs = require("fs");

async function fetchLogs() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp-groza-bot.alwaysdata.net",
            user: "groza-bot",
            password: "2734010Ab!!))",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        
        console.log("Downloading log...");
        await client.downloadTo("remote-error.log", "admin/logs/sites/groza-bot.alwaysdata.net.log");
        console.log("Log downloaded. Tail:");
        const content = fs.readFileSync("remote-error.log", "utf8");
        const lines = content.split('\n');
        console.log(lines.slice(-50).join('\n'));
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

fetchLogs();
