const ftp = require("basic-ftp");
async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp-groza-bot.alwaysdata.net",
            user: "groza-bot",
            password: "2734010Ab!!))",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        
        await client.downloadTo("m:/Projects/Bot/Groza/sites-08.log", "/admin/logs/sites/2026/sites-2026-07-08.log");
        await client.downloadTo("m:/Projects/Bot/Groza/http-08.log", "/admin/logs/http/2026/http-2026-07-08.log");
        console.log("Downloaded.");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}
run();
