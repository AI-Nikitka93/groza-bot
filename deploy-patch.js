const ftp = require("basic-ftp");

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
        await client.uploadFrom("m:/Projects/Bot/Groza/package.json", "package.json");
        console.log("FTP Upload complete!");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

deploy();
