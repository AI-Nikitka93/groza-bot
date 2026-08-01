const fs = require('fs');

const entry = `
### 2026-07-08 13:25:00 +03:00 - Инцидент: Бот перестал отвечать (Webhook Timeout/404)
- Changed: Исправлена обработка вебхуков Telegram в \`src/api.ts\`. Ранее Express-объект \`res\` передавался внутрь \`bot.handleUpdate(parsedBody, res)\`, из-за чего Telegraf переключался в режим Webhook Reply и конфликтовал с нашей ручной отправкой \`res.sendStatus(200)\`. Это приводило к тому, что Telegram получал ошибки 404 (или таймауты) и приостанавливал доставку апдейтов (бот "не отвечал"). Теперь \`res\` не передается в Telegraf, и Express сразу возвращает HTTP 200 OK, а Telegraf отправляет ответы через стандартный HTTP API (\`bot.telegram.callApi\`). Был принудительно сброшен вебхук через \`deleteWebhook\` для очистки кэша ошибок Telegram.
- Files: \`src/api.ts\`
- Verification: Проверено через \`/api/debug-env\` (отвечает 200), \`getWebhookInfo\` (ошибка 404 исчезла, \`pending_update_count: 0\`). Фейковый POST-запрос к вебхуку успешно обработан. Код сбилжен и задеплоен (\`npm run build\`, \`node deploy-dist.js\`).
- Status: DONE (Verdict: PASS)
`;

fs.appendFileSync('AGENTS_HISTORY.md', entry);
console.log('Appended.');
