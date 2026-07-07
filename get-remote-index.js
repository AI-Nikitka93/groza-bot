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
        
        await client.downloadTo("remote_index.js", "/www/dist/index.js");
        console.log("Downloaded remote index.js");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

check();
