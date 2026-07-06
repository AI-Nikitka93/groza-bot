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
        
        // Check if public folder exists, create if not
        try {
            await client.cd("public");
            await client.cd("..");
        } catch (e) {
            await client.send("MKD public");
        }

        console.log("Uploading public folder...");
        await client.uploadDir("m:/Projects/Bot/Groza/public", "public");
        
        console.log("FTP Upload complete!");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

deploy();
