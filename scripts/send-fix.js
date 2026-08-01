const { Client } = require('pg');

async function sendFix() {
  const dbUrl = "postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const token = "8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo";
  const webAppUrl = "https://groza-bot.alwaysdata.net/index.html";

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT id FROM users;');
    const users = res.rows;
    console.log(`Found ${users.length} users.`);

    for (const u of users) {
      const chatId = u.id;
      const text = "Я полностью починил карту! У вас открывался Google, потому что вы нажимали на старую кнопку из старого сообщения.\n\nВот новая кнопка с уже правильным адресом карты. Нажмите на нее!";
      
      const payload = {
        chat_id: chatId,
        text: text,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🗺 Открыть Карту",
                web_app: {
                  url: webAppUrl
                }
              }
            ]
          ]
        }
      };

      const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      console.log(`Sent to ${chatId}:`, data.ok);
    }
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await client.end();
  }
}

sendFix();
