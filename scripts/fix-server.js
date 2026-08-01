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
        
        console.log("Removing modules.zip...");
        try { await client.remove('/www/modules.zip'); } catch(e) { console.log(e.message); }
        
        console.log("Uploading dist...");
        await client.uploadDir("dist", "/www/dist");
        
        console.log("Touching restart.txt in /www/tmp...");
        require('fs').writeFileSync('restart.txt', Date.now().toString());
        try { await client.ensureDir('/www/tmp'); } catch(e){}
        await client.uploadFrom('restart.txt', '/www/tmp/restart.txt');
        
        console.log("Done.");
    } catch (e) {
        console.error(e);
    }
    client.close();
}
run();
