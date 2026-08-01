import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import * as readline from 'readline';

const apiId = process.env.TG_API_ID ? parseInt(process.env.TG_API_ID) : 0;
const apiHash = process.env.TG_API_HASH || '';
const stringSession = new StringSession(process.env.TG_SESSION || '');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  if (!apiId || !apiHash) {
    console.error('Missing TG_API_ID or TG_API_HASH environment variables.');
    process.exit(1);
  }

  console.log('Initializing Telegram Client for E2E Test...');
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => new Promise((resolve) => rl.question('Please enter your number: ', resolve)),
    password: async () => new Promise((resolve) => rl.question('Please enter your password: ', resolve)),
    phoneCode: async () => new Promise((resolve) => rl.question('Please enter the code you received: ', resolve)),
    onError: (err) => console.log(err),
  });
  console.log('You should now be connected.');
  console.log('Session string (save this to TG_SESSION env var to avoid relogin):', client.session.save());

  const botUsername = process.env.BOT_USERNAME || '@GrozaTestBot'; // Replace with actual bot username

  console.log(`Sending /start to ${botUsername}...`);
  await client.sendMessage(botUsername, { message: '/start' });
  await new Promise(r => setTimeout(r, 2000));

  console.log(`Sending /status to ${botUsername}...`);
  await client.sendMessage(botUsername, { message: '/status' });
  await new Promise(r => setTimeout(r, 2000));

  console.log(`Sending /weather to ${botUsername}...`);
  await client.sendMessage(botUsername, { message: '/weather' });
  
  console.log('Commands sent. Listening for replies for 10 seconds...');
  
  client.addEventHandler((update: any) => {
    if (update?.message?.message) {
      console.log(`[BOT REPLY]: ${update.message.message}`);
    }
  });

  await new Promise(r => setTimeout(r, 10000));
  console.log('E2E Test sequence completed.');
  process.exit(0);
})();
