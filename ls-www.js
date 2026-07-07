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
        const list = await client.list('/www');
        console.log('--- WWW ---');
        list.forEach(f => console.log(f.type === 2 ? '[DIR] ' + f.name : '[FILE] ' + f.name));
    } catch (e) {
        console.error(e);
    }
    client.close();
}
run();
