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

    // Запускаем SSH команды для копирования конфига и перезапуска воркеров Passenger
    console.log("Connecting via SSH to restore config and restart processes...");
    const conn = new Client();
    conn.on('ready', () => {
        const cmd = `
            cp /home/groza-bot/www/.env /home/groza-bot/www/dist/config.env
            chmod 600 /home/groza-bot/www/dist/config.env
            pkill -u groza-bot -f node || true
        `;
        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error("SSH Exec Error:", err);
                conn.end();
                return;
            }
            stream.on('close', () => {
                console.log("SSH Operations complete (config.env copied, node processes killed).");
                conn.end();
            }).on('data', (data) => {
                process.stdout.write(data);
            }).stderr.on('data', (data) => {
                process.stderr.write(data);
            });
        });
    }).on('error', (err) => {
        console.error('SSH Connection Error:', err);
    }).connect({
        host: 'ssh-groza-bot.alwaysdata.net',
        port: 22,
        username: 'groza-bot',
        password: '2734010Ab!!))'
    });
}

deploy();
