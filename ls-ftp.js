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
        
        console.log("Root directory:");
        const list = await client.list("/");
        for(let item of list) {
            console.log(item.type === 2 ? "[DIR]" : "[FILE]", item.name);
        }
        
        console.log("Downloading logs...");
        await client.downloadToDir("m:/Projects/Bot/Groza/logs_remote", "/admin/logs/sites");
        console.log("Logs downloaded.");

    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

run();
