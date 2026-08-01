const ftp = require('basic-ftp');
async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: 'ftp-groza-bot.alwaysdata.net',
            user: 'groza-bot',
            password: '2734010Ab!!))',
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        await client.uploadFrom('kill.php', '/www/kill.php');
        console.log('Uploaded kill.php');
    } catch (e) {
        console.error(e);
    }
    client.close();
}
run();
