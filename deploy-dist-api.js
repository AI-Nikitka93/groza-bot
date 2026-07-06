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
        await client.cd("dist");

        console.log("Uploading api.js...");
        await client.uploadFrom("m:/Projects/Bot/Groza/dist/api.js", "api.js");
        
        console.log("FTP Upload complete!");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

deploy();
