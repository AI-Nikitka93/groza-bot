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
        
        console.log("Listing /admin/logs directory:");
        const list = await client.list("/admin/logs");
        for(let item of list) {
            console.log(item.type === 2 ? "[DIR]" : "[FILE]", item.name);
        }
        
        console.log("Listing /admin/logs/sites directory:");
        const listSites = await client.list("/admin/logs/sites");
        for(let item of listSites) {
            console.log(item.type === 2 ? "[DIR]" : "[FILE]", item.name);
        }
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

check();
