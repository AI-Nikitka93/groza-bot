const ftp = require("basic-ftp");
const fs = require("fs");

async function check() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "ftp-groza-bot.alwaysdata.net",
            user: "groza-bot",
            password: "2734010Ab!!))",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        
        console.log("Listing www directory:");
        const list = await client.list("/www");
        for(let item of list) {
            console.log(item.type === 2 ? "[DIR]" : "[FILE]", item.name);
        }
        
        console.log("Checking if kill_log.txt exists...");
        const logFile = list.find(item => item.name === 'kill_log.txt');
        if (logFile) {
            console.log("Found kill_log.txt. Downloading...");
            await client.downloadTo("kill_log.txt", "/www/kill_log.txt");
            console.log("Contents of kill_log.txt:");
            console.log(fs.readFileSync("kill_log.txt", "utf8"));
        } else {
            console.log("kill_log.txt not found in /www");
        }
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

check();
