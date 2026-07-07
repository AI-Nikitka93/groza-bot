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
        const list1 = await client.list('/www');
        const list2 = await client.list('/www/tmp');
        const list3 = await client.list('/www/dist/tmp');
        console.log('www/restart.txt:', list1.find(f => f.name === 'restart.txt')?.modifiedAt);
        console.log('www/tmp/restart.txt:', list2.find(f => f.name === 'restart.txt')?.modifiedAt);
        console.log('www/dist/tmp/restart.txt:', list3.find(f => f.name === 'restart.txt')?.modifiedAt);
    } catch (e) {
        console.error(e);
    }
    client.close();
}
run();
