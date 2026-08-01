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
        
        console.log("admin/logs/sites directory:");
        const list2 = await client.list("/admin/logs/sites/");
        for(let item of list2) {
            console.log(item.type === 2 ? "[DIR]" : "[FILE]", item.name);
        }
        
        console.log("Checking log files...");
        const logFile = list2.find(item => item.name.includes('.log'));
        if (logFile) {
            console.log(`Downloading ${logFile.name}...`);
            await client.downloadTo(`m:/Projects/Bot/Groza/${logFile.name}`, `/admin/logs/sites/${logFile.name}`);
            console.log("Log downloaded.");
        }

    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

run();
