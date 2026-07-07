const fs = require('fs');

const date = new Date();
const timeString = date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

const logEntry = `\n### ${timeString} — Фикс ошибки сохранения локации в БД (geometry -> geography)
- Changed: Исправлен тип колонки \`location\` в таблице \`users\` (geometry -> geography) путем добавления авто-миграции в \`src/db/tembo.ts\`. Добавлено явное приведение типов (Number) для координат в \`src/bot/handlers/webapp.ts\`, чтобы избежать возможных ошибок с типизацией. Изменен тип перехвата ошибки в \`src/db/tembo.ts\` на \`e: any\` для устранения ошибки компиляции TS.
- Files: \`src/db/tembo.ts\`, \`src/bot/handlers/webapp.ts\`
- Verification: Успешно запущены тесты через \`adwp_runner.ps1\` (Exit Code 0).
- Status: DONE.
`;

const projectHistoryPath = 'docs/PROJECT_HISTORY.md';
const agentsHistoryPath = 'AGENTS_HISTORY.md';

if (fs.existsSync(projectHistoryPath)) {
  fs.appendFileSync(projectHistoryPath, logEntry);
}

if (fs.existsSync(agentsHistoryPath)) {
  fs.appendFileSync(agentsHistoryPath, logEntry);
}

console.log('Logs updated.');
