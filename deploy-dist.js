const ftp = require("basic-ftp");
const { Client } = require('ssh2');

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
        console.log("Uploading dist folder...");
        await client.uploadDir("dist", "dist");
        console.log("FTP Upload complete!");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();

    console.log("Creating tmp/restart.txt to restart passenger via FTP...");
    try {
        const client2 = new ftp.Client();
        await client2.access({
            host: "ftp-groza-bot.alwaysdata.net",
            user: "groza-bot",
            password: "2734010Ab!!))",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        require('fs').writeFileSync('restart.txt', '');
        await client2.cd('www/tmp').catch(e => client2.cd('www').then(() => client2.ensureDir('tmp')));
        await client2.uploadFrom('restart.txt', 'restart.txt');
        console.log("Passenger restart triggered.");
        client2.close();
    } catch(err) {
        console.log("FTP restart error: ", err);
    }
}

deploy();
