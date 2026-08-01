const ftp = require("basic-ftp");
async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp-groza-bot.alwaysdata.net",
            user: "groza-bot",
            password: "2734010Ab!!))",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        
        async function listDir(path) {
            const list = await client.list(path);
            for(let item of list) {
                console.log(`${path}${item.name}`);
                if (item.type === 2) {
                    await listDir(`${path}${item.name}/`);
                }
            }
        }
        await listDir("/admin/logs/");
    }
    catch(err) {
        console.log("FTP Error: ", err);
    }
    client.close();
}
run();
