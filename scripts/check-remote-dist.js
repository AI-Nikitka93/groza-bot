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
        
        console.log("Listing /www/dist directory:");
        const list = await client.list("/www/dist");
        for(let item of list) {
            console.log(item.type === 2 ? "[DIR]" : "[FILE]", item.name);
        }
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

check();
