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
        try {
            await client.cd("tmp");
        } catch(e) {
            await client.send("MKD tmp");
            await client.cd("tmp");
        }

        console.log("Touching restart.txt...");
        const requireFtp = require("fs");
        requireFtp.writeFileSync("restart.txt", Date.now().toString());
        await client.uploadFrom("restart.txt", "restart.txt");
        requireFtp.unlinkSync("restart.txt");
        
        console.log("FTP Restart trigger complete!");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

deploy();
