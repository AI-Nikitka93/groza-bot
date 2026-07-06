const ftp = require("basic-ftp");
const path = require("path");

async function deploy() {
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
        
        console.log("Connected to FTP. Clearing remote www folder...");
        // Go to www
        await client.cd("www");
        
        console.log("Uploading files...");
        // Upload individual files
        await client.uploadFrom("package.json", "package.json");
        await client.uploadFrom("tsconfig.json", "tsconfig.json");
        await client.uploadFrom("render.yaml", "render.yaml");
        await client.uploadFrom(".env", ".env");
        
        // Upload directories
        await client.uploadDir("src", "src");
        await client.uploadDir("public", "public");

        console.log("FTP Upload complete!");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}

deploy();
