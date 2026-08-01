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
        await client.downloadTo('api.js.downloaded', '/www/dist/api.js');
        console.log('Downloaded api.js');
    } catch (e) {
        console.error(e);
    }
    client.close();
}
run();
