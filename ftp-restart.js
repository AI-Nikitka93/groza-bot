const ftp = require("basic-ftp");
async function restart() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp-groza-bot.alwaysdata.net",
            user: "groza-bot",
            password: "2734010Ab!!))",
            secure: false
        });
        require('fs').writeFileSync('restart.txt', '');
        await client.cd('www/tmp').catch(e => client.cd('www').then(() => client.ensureDir('tmp')));
        await client.uploadFrom('restart.txt', 'restart.txt');
        console.log("Passenger restart triggered.");
        client.close();
    } catch(err) {
        console.log("FTP restart error: ", err);
        client.close();
    }
}
restart();
