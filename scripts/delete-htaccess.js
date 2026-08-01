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
        await client.remove('/www/.htaccess');
        await client.remove('/www/kill.php');
        console.log('Deleted .htaccess and kill.php');
    } catch (e) {
        console.error(e);
    }
    client.close();
}
run();
