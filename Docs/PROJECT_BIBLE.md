# Project Bible: Groza Bot

### Файл: .env
- **Полный путь**: M:\Projects\Bot\Groza\.env
- **Размер**: 1446 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 8: TELEGRAM_BOT_TOKEN="********"
  Line 17: UPSTASH_REDIS_REST_TOKEN="********"
  Line 22: # Регистрация: https://api.imgur.com/oauth2/addclient
  Line 26: # Обязательно: User ID и Long-Lived Access Token (60 дней)
  Line 29: THREADS_ACCESS_TOKEN="********"

---

### Файл: .env.downloaded
- **Полный путь**: M:\Projects\Bot\Groza\.env.downloaded
- **Размер**: 1568 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 8: TELEGRAM_BOT_TOKEN="********"
  Line 17: UPSTASH_REDIS_REST_TOKEN="********"
  Line 22: # Регистрация: https://api.imgur.com/oauth2/addclient
  Line 26: # Обязательно: User ID и Long-Lived Access Token (60 дней)
  Line 29: THREADS_ACCESS_TOKEN="********"

---

### Файл: .env.example
- **Полный путь**: M:\Projects\Bot\Groza\.env.example
- **Размер**: 1334 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 8: TELEGRAM_BOT_TOKEN="********"
  Line 12: DATABASE_URL="********"
  Line 17: UPSTASH_REDIS_REST_TOKEN="********"
  Line 18: REDIS_URL="********"
  Line 22: # Регистрация: https://api.imgur.com/oauth2/addclient
  Line 26: # Обязательно: User ID и Long-Lived Access Token (60 дней)
  Line 29: THREADS_ACCESS_TOKEN="********"

---

### Файл: .gitignore
- **Полный путь**: M:\Projects\Bot\Groza\.gitignore
- **Размер**: 33 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: .htaccess
- **Полный путь**: M:\Projects\Bot\Groza\.htaccess
- **Размер**: 97 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: AGENTS_HISTORY.md
- **Полный путь**: M:\Projects\Bot\Groza\AGENTS_HISTORY.md
- **Размер**: 30886 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: alwaysdata-api.js
- **Полный путь**: M:\Projects\Bot\Groza\alwaysdata-api.js
- **Размер**: 1612 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Line 3: const auth = Buffer.from('********').toString('********');
  Line 10: '********': '********' + auth
  Line 34: '********': '********' + auth

---

### Файл: api-test-new.js
- **Полный путь**: M:\Projects\Bot\Groza\api-test-new.js
- **Размер**: 790 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Line 3: const tokens = [
  Line 13: const auth = Buffer.from(tokenStr).toString('********');
  Line 14: https.get('********', {headers: {'********': '********' + auth}}, res =******** {
  Line 15: resolve({token: tokenStr, status: res.statusCode});
  Line 16: }).on('********', () =******** resolve({token: tokenStr, status: '********'}));
  Line 22: const res = await testToken(t);
  Line 23: console.log(`Token: ${res.token} =******** Status: ${res.status}`);

---

### Файл: api-test.js
- **Полный путь**: M:\Projects\Bot\Groza\api-test.js
- **Размер**: 768 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Line 3: const tokens = [
  Line 13: const auth = Buffer.from(tokenStr).toString('********');
  Line 14: https.get('********', {headers: {'********': '********' + auth}}, res =******** {
  Line 15: resolve({token: tokenStr, status: res.statusCode});
  Line 16: }).on('********', () =******** resolve({token: tokenStr, status: '********'}));
  Line 22: const res = await testToken(t);
  Line 23: console.log(`Token: ${res.token} =******** Status: ${res.status}`);

---

### Файл: api.js.downloaded
- **Полный путь**: M:\Projects\Bot\Groza\api.js.downloaded
- **Размер**: 10808 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: express, cors, path, ./alerting/store, ./env, ./cache/upstash, ./db/tembo, ./bot
- **Секреты (замаскированы)**:
  Line 40: TELEGRAM_BOT_TOKEN: env_1.ENV.TELEGRAM_BOT_TOKEN
  Line 45: const botId = env_1.ENV.TELEGRAM_BOT_TOKEN.split('********')[0].replace(/\r/g, '********');

---

### Файл: append-history.js
- **Полный путь**: M:\Projects\Bot\Groza\append-history.js
- **Размер**: 1621 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: build-zip.js
- **Полный путь**: M:\Projects\Bot\Groza\build-zip.js
- **Размер**: 929 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs, archiver
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: check-admin-dir.js
- **Полный путь**: M:\Projects\Bot\Groza\check-admin-dir.js
- **Размер**: 736 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: check-log.js
- **Полный путь**: M:\Projects\Bot\Groza\check-log.js
- **Размер**: 1238 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: check-logs-dir.js
- **Полный путь**: M:\Projects\Bot\Groza\check-logs-dir.js
- **Размер**: 1003 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: check-remote-dist.js
- **Полный путь**: M:\Projects\Bot\Groza\check-remote-dist.js
- **Размер**: 742 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: check-remote-weather.js
- **Полный путь**: M:\Projects\Bot\Groza\check-remote-weather.js
- **Размер**: 758 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: check-restart-time.js
- **Полный путь**: M:\Projects\Bot\Groza\check-restart-time.js
- **Размер**: 889 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: check-root-log.js
- **Полный путь**: M:\Projects\Bot\Groza\check-root-log.js
- **Размер**: 1247 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: check-stats.js
- **Полный путь**: M:\Projects\Bot\Groza\check-stats.js
- **Размер**: 766 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: pg, bullmq, ioredis, dotenv
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: check-tmp.js
- **Полный путь**: M:\Projects\Bot\Groza\check-tmp.js
- **Размер**: 740 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: check_db.js
- **Полный путь**: M:\Projects\Bot\Groza\check_db.js
- **Размер**: 603 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: dotenv, pg
- **Секреты (замаскированы)**:
  Line 5: ssl: { rejectUnauthorized: false }

---

### Файл: check_db_user.js
- **Полный путь**: M:\Projects\Bot\Groza\check_db_user.js
- **Размер**: 391 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: pg, dotenv
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: check_deployed_api.js
- **Полный путь**: M:\Projects\Bot\Groza\check_deployed_api.js
- **Размер**: 461 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2
- **Секреты (замаскированы)**:
  Line 8: }).connect({host: '********', port: 22, username: '********', password: '********'});

---

### Файл: config\assets_manifest.json
- **Полный путь**: M:\Projects\Bot\Groza\config\assets_manifest.json
- **Размер**: 2096 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: config\data_access_config.json
- **Полный путь**: M:\Projects\Bot\Groza\config\data_access_config.json
- **Размер**: 1223 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: cookies.txt
- **Полный путь**: M:\Projects\Bot\Groza\cookies.txt
- **Размер**: 135 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 2: # https://curl.se/docs/http-cookies.html

---

### Файл: crash-concurrent.js
- **Полный путь**: M:\Projects\Bot\Groza\crash-concurrent.js
- **Размер**: 1246 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: crash-json.js
- **Полный путь**: M:\Projects\Bot\Groza\crash-json.js
- **Размер**: 803 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: http, https
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: crash-string.js
- **Полный путь**: M:\Projects\Bot\Groza\crash-string.js
- **Размер**: 1072 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: crash.js
- **Полный путь**: M:\Projects\Bot\Groza\crash.js
- **Размер**: 473 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: crash.php
- **Полный путь**: M:\Projects\Bot\Groza\crash.php
- **Размер**: 839 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: delete-htaccess.js
- **Полный путь**: M:\Projects\Bot\Groza\delete-htaccess.js
- **Размер**: 576 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-dist-api.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-dist-api.js
- **Размер**: 709 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 9: password: "********",
  Line 11: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-dist.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-dist.js
- **Размер**: 1364 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, ssh2, fs
- **Секреты (замаскированы)**:
  Line 10: password: "********",
  Line 12: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-env.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-env.js
- **Размер**: 655 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 9: password: "********",
  Line 11: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-ftp.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-ftp.js
- **Размер**: 1165 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, path
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-modules.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-modules.js
- **Размер**: 822 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 9: password: "********",
  Line 11: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-patch.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-patch.js
- **Размер**: 629 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 9: password: "********",
  Line 11: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-public.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-public.js
- **Размер**: 907 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 9: password: "********",
  Line 11: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy-restart.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy-restart.js
- **Размер**: 991 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 9: password: "********",
  Line 11: secureOptions: { rejectUnauthorized: false }

---

### Файл: deploy.js
- **Полный путь**: M:\Projects\Bot\Groza\deploy.js
- **Размер**: 1610 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2, fs, child_process
- **Секреты (замаскированы)**:
  Line 45: password: '********'

---

### Файл: Docs\assets.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\assets.md
- **Размер**: 4165 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\copy.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\copy.md
- **Размер**: 5992 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\data_access_decision.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\data_access_decision.md
- **Размер**: 4974 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\DESIGN.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\DESIGN.md
- **Размер**: 8142 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\design_soul_document.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\design_soul_document.md
- **Размер**: 11077 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\design_ux_research.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\design_ux_research.md
- **Размер**: 9860 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\PRODUCTION_SETUP.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\PRODUCTION_SETUP.md
- **Размер**: 4790 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 14: 1. Перейдите на [Imgur API Registration](https://api.imgur.com/oauth2/addclient).
  Line 28: ### Шаг 3.2: Получение токенов (User Access Token)
  Line 34: ### Шаг 3.3: Обмен на Long-Lived Token
  Line 37: curl -X GET "********"
  Line 40: Ваш ID в Threads можно найти, сделав запрос `GET https://graph.threads.net/v1.0/me?access_token=******** Вставьте его в `THREADS_USER_ID`.
  Line 45: curl -X GET "********"
  Line 51: - **Upstash Redis:** Зарегистрируйтесь на [Upstash.com](https://upstash.com/), создайте БД Redis. Скопируйте URL и REST Token в `.env`.

---

### Файл: Docs\product_strategy.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\product_strategy.md
- **Размер**: 7136 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\PROJECT_HISTORY.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\PROJECT_HISTORY.md
- **Размер**: 11894 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\QA_REPORT.md
- **Полный путь**: M:\Projects\Bot\Groza\Docs\QA_REPORT.md
- **Размер**: 3337 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: Docs\Идея.txt
- **Полный путь**: M:\Projects\Bot\Groza\Docs\Идея.txt
- **Размер**: 36793 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: download-config.js
- **Полный путь**: M:\Projects\Bot\Groza\download-config.js
- **Размер**: 589 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: download-dist.js
- **Полный путь**: M:\Projects\Bot\Groza\download-dist.js
- **Размер**: 544 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: download-env.js
- **Полный путь**: M:\Projects\Bot\Groza\download-env.js
- **Размер**: 533 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: download-package.js
- **Полный путь**: M:\Projects\Bot\Groza\download-package.js
- **Размер**: 557 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: e2e_simulate.ts
- **Полный путь**: M:\Projects\Bot\Groza\e2e_simulate.ts
- **Размер**: 2144 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ./src/alerting/dispatcher, ./src/db/tembo, ./src/alerting/queue, ./src/bot
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: fetch-logs.js
- **Полный путь**: M:\Projects\Bot\Groza\fetch-logs.js
- **Размер**: 672 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2
- **Секреты (замаскированы)**:
  Line 22: password: '********'

---

### Файл: find-logs.js
- **Полный путь**: M:\Projects\Bot\Groza\find-logs.js
- **Размер**: 813 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: "********",
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: find_api.js
- **Полный путь**: M:\Projects\Bot\Groza\find_api.js
- **Размер**: 453 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2
- **Секреты (замаскированы)**:
  Line 9: }).connect({host: '********', port: 22, username: '********', password: '********'});

---

### Файл: fix-server.js
- **Полный путь**: M:\Projects\Bot\Groza\fix-server.js
- **Размер**: 1001 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: ftp-restart.js
- **Полный путь**: M:\Projects\Bot\Groza\ftp-restart.js
- **Размер**: 704 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 8: password: "********",

---

### Файл: generate_bible.js
- **Полный путь**: M:\Projects\Bot\Groza\generate_bible.js
- **Размер**: 3159 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs, path
- **Секреты (замаскированы)**:
  Line 44: const secretKeys = ['********', '********', '********', '********', '********', '********', '********', '********'];
  Line 45: const foundSecrets = [];
  Line 50: if (secretKeys.some(key =******** lowerLine.includes(key)) && (line.includes('********') || line.includes('********'))) {
  Line 54: foundSecrets.push(`Line ${i+1}: ${redacted.trim()}`);
  Line 74: (foundSecrets.length > 0 ? foundSecrets.join('********') : '********') +

---

### Файл: get-logs-08.js
- **Полный путь**: M:\Projects\Bot\Groza\get-logs-08.js
- **Размер**: 726 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: "********",
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: get-logs-ftp.js
- **Полный путь**: M:\Projects\Bot\Groza\get-logs-ftp.js
- **Размер**: 850 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 10: password: "********",
  Line 12: secureOptions: { rejectUnauthorized: false }

---

### Файл: get-remote-index.js
- **Полный путь**: M:\Projects\Bot\Groza\get-remote-index.js
- **Размер**: 645 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: get-remote-package.js
- **Полный путь**: M:\Projects\Bot\Groza\get-remote-package.js
- **Размер**: 652 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp, fs
- **Секреты (замаскированы)**:
  Line 11: password: "********",
  Line 13: secureOptions: { rejectUnauthorized: false }

---

### Файл: get-ssh-logs.js
- **Полный путь**: M:\Projects\Bot\Groza\get-ssh-logs.js
- **Размер**: 730 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2
- **Секреты (замаскированы)**:
  Line 22: password: '********'

---

### Файл: get-token.js
- **Полный путь**: M:\Projects\Bot\Groza\get-token.js
- **Размер**: 649 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2
- **Секреты (замаскированы)**:
  Line 5: conn.exec("********", (err, stream) =******** {
  Line 20: password: '********'

---

### Файл: http-08.log
- **Полный путь**: M:\Projects\Bot\Groza\http-08.log
- **Размер**: 642 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: huge_file
- **Полный путь**: M:\Projects\Bot\Groza\huge_file
- **Размер**: 20971520 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: kill-node.js
- **Полный путь**: M:\Projects\Bot\Groza\kill-node.js
- **Размер**: 623 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2
- **Секреты (замаскированы)**:
  Line 21: password: '********'

---

### Файл: kill.php
- **Полный путь**: M:\Projects\Bot\Groza\kill.php
- **Размер**: 57 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: login_response.html
- **Полный путь**: M:\Projects\Bot\Groza\login_response.html
- **Размер**: 132384 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 98: <div id="********">
  Line 105: <input type="********" name="********" value="********">
  Line 111: Courriel<span class="********">*</span> </label> <div class="********"> <input type="********" name="********" value="********" maxlength="********" class="********" required id="********"> </div> </div> <div id="********" class="********"> <label for="********"  class="********">
  Line 112: Mot de passe<span class="********">*</span> </label> <div class="********"> <input type="********" name="********" maxlength="********" class="********" required id="********"> </div> </div> <div class="********"> <div id="********" class="********"> <label for="********" class="********"> <input type="********" name="********" class="********" id="********">
  Line 121: <a href="********">Mot de passe oublié</a>
  Line 174: #oauth-providers a:is(:hover, :focus-visible) {
  Line 206: <div id="********">
  Line 207: <a class="********" id="********" href="********">
  Line 211: <a class="********" id="********" href="********">

---

### Файл: logs_remote\2026\sites-2026-07-05.log
- **Полный путь**: M:\Projects\Bot\Groza\logs_remote\2026\sites-2026-07-05.log
- **Размер**: 382275 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 1: [05/Jul/2026:16:31:07 +0200] [upstream] Upstream starting: npm install && npm run build && npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/)
  Line 13: [05/Jul/2026:16:31:08 +0200] [upstream] Upstream starting: npm install && npm run build && npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/)
  Line 25: [05/Jul/2026:16:33:22 +0200] [upstream] Upstream starting: npm install && npm run build && npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/)
  Line 38: [05/Jul/2026:16:46:54 +0200] [upstream] Upstream starting: cd www && npm install && npm run build && npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/)
  Line 42: [05/Jul/2026:16:50:12 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/home/groza-bot/www/)
  Line 45: [05/Jul/2026:16:52:16 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 71: [05/Jul/2026:16:52:18 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 97: [05/Jul/2026:16:54:40 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 132: [05/Jul/2026:16:56:05 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 140: [05/Jul/2026:16:56:21 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 148: [05/Jul/2026:16:57:09 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 161: [05/Jul/2026:16:57:09 +0200] [upstream] [1872127] STDOUT: ◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
  Line 901: [05/Jul/2026:17:07:39 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1940: [05/Jul/2026:17:09:29 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********"8516017309:AAHZ4PVY46dywE1nmGLOFCclzy1MKA07Ppo"********', '********': '********', '********': '********', '********': '********"postgresql://neondb_owner:npg_tWIvK3DGLl0w@ep-purple-morning-at630e0v-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=********"********', '********': '********', '********': '********', '********': '********"https://upstash-url.upstash.io"********', '********': '********"your_rest_token_here"********', '********': '********"rediss://default:gQAAAAAAAbQnAAIgcDE2NDY2N2UyZmQ2ZGE0OTJmYmI0ZjUxMzQxNDc0YjljYw@valued-lion-111655.upstash.io:6379"********', '********': '********', '********': '********', '********': '********', '********': '********"your_client_id_here"********', '********': '********', '********': '********', '********': '********', '********': '********"123456789012345"********', '********': '********"EAAXXXXXXX_long_lived_token_here"********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 2737: [05/Jul/2026:17:10:33 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 2761: [05/Jul/2026:22:14:21 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 2767: [05/Jul/2026:22:14:21 +0200] [upstream] [2374903] STDOUT: ◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
  Line 2785: [05/Jul/2026:23:06:30 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 2791: [05/Jul/2026:23:06:30 +0200] [upstream] [2458365] STDOUT: ◇ injected env (1) from .env // tip: ⌁ auth for agents [www.vestauth.com]

---

### Файл: logs_remote\2026\sites-2026-07-05.log.gz
- **Полный путь**: M:\Projects\Bot\Groza\logs_remote\2026\sites-2026-07-05.log.gz
- **Размер**: 16476 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: logs_remote\2026\sites-2026-07-06.log
- **Полный путь**: M:\Projects\Bot\Groza\logs_remote\2026\sites-2026-07-06.log
- **Размер**: 304246 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 1: [06/Jul/2026:10:14:08 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 36: [06/Jul/2026:10:14:09 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 71: [06/Jul/2026:10:15:46 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 106: [06/Jul/2026:10:18:24 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 142: [06/Jul/2026:10:20:52 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1191: [06/Jul/2026:10:20:55 +0200] [upstream] [3584092] STDOUT: ◇ injected env (1) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
  Line 1220: [06/Jul/2026:10:21:21 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1241: [06/Jul/2026:11:24:38 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1264: [06/Jul/2026:11:26:05 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1270: [06/Jul/2026:11:26:05 +0200] [upstream] [3683919] STDOUT: ◇ injected env (1) from .env // tip: ⌁ auth for agents [www.vestauth.com]
  Line 1349: [06/Jul/2026:12:14:15 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1455: [06/Jul/2026:14:25:30 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)

---

### Файл: logs_remote\2026\sites-2026-07-06.log.gz
- **Полный путь**: M:\Projects\Bot\Groza\logs_remote\2026\sites-2026-07-06.log.gz
- **Размер**: 14943 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: logs_remote\2026\sites-2026-07-07.log
- **Полный путь**: M:\Projects\Bot\Groza\logs_remote\2026\sites-2026-07-07.log
- **Размер**: 294973 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 1815: [07/Jul/2026:19:21:20 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1825: [07/Jul/2026:19:21:24 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1835: [07/Jul/2026:19:21:28 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1843: [07/Jul/2026:19:21:36 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1853: [07/Jul/2026:19:21:52 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1865: [07/Jul/2026:19:22:13 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 1877: [07/Jul/2026:19:24:13 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 2049: [07/Jul/2026:20:09:13 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 2523: [07/Jul/2026:21:56:39 +0200] [upstream] Upstream starting: npm start (env: {'********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********', '********': '********'}, cwd: /home/groza-bot/www)
  Line 2529: [07/Jul/2026:21:56:40 +0200] [upstream] [2822860] STDOUT: ◇ injected env (1) from dist/config.env // tip: ◈ secrets for agents [www.dotenvx.com]

---

### Файл: log_update.js
- **Полный путь**: M:\Projects\Bot\Groza\log_update.js
- **Размер**: 1349 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: ls-ftp.js
- **Полный путь**: M:\Projects\Bot\Groza\ls-ftp.js
- **Размер**: 1070 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 9: password: "********",
  Line 11: secureOptions: { rejectUnauthorized: false }

---

### Файл: ls-www.js
- **Полный путь**: M:\Projects\Bot\Groza\ls-www.js
- **Размер**: 607 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: map.js
- **Полный путь**: M:\Projects\Bot\Groza\map.js
- **Размер**: 97682 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 1: var _0x116615=******** _0x48c386=******** _0x253180=******** _0x3ce1b2['********'](_0x3ce1b2['********']());}catch(_0x501324){_0x3ce1b2['********'](_0x3ce1b2['********']());}}}(_0x3d05,0xeb113));const version_txt='********';console[_0x116615(0x27a)](_0x116615(0x158));const HeaderMuteIcon=******** AdvertismentDiv_120_600,AdvertismentDiv_468_60,AdvertismentDiv_320_50,AdvertismentDiv_auto;ex_Advertisment=********'********'),AdvertismentDiv_auto=********'********'](_0x116615(0xed)));const HeaderDiv=********'********'),InfoDiv=********'********'),DelayDiv=********'********'](_0x116615(0x16f)),ReloadDiv=********'********'](_0x116615(0x27c)),UsersDiv=********'********'),MenuButtonDiv=********'********'),VisitorsSelectionSpan=********'********'](_0x116615(0xd0)),RegionSpan=********'********'),CoverageSpan=********'********']('********'),DayNightSpan=******** AdvertismentSpan;ex_Advertisment=********'********'](_0x116615(0x1fe)));const VisitorsSpan=********'********'),HomeSpan=********'********'](_0x116615(0x165)),ResetSpan=******** MapStyleRange=********'********'](_0x116615(0xff)),CountingRange=********'********'),CountingCheckbox=********'********'](_0x116615(0xf6)),CirclesCheckbox=********'********']('********'),TimeRange=********'********'](_0x116615(0x208)),SpeedRange=********'********'](_0x116615(0x182)),DetectorsRange=********'********'](_0x116615(0xd9)),RegionRange=********'********']('********'),CoverageCheckbox=********'********'),DayNightRange=********'********'),AudioCheckbox=********'********'),ExtendedModeCheckbox=********'********'),VisitorsRange=********'********'](_0x116615(0x241)),VisitorsCheckbox=********'********'),HomeCheckbox=********'********']('********'),maxMapStyles=******** MapStyleFiles=******** Array(_0x116615(0xe5),_0x116615(0x217),_0x116615(0x114));const RegionNames=******** Array('********','********',_0x116615(0xc7),_0x116615(0x201),'********',_0x116615(0x146),_0x116615(0x160),_0x116615(0x12f),'********',_0x116615(0x261),_0x116615(0x1b0),'********',_0x116615(0x15f),_0x116615(0xe4),'********',_0x116615(0x10d),_0x116615(0x16c),_0x116615(0x16c)),maxMarkers=******** Array(_0x116615(0x23f),_0x116615(0x1e9),'********','********'),ws_servers_abbr=******** Array(_0x116615(0x15a),'********',_0x116615(0x210),'********');var MapStyle=******** MapStyleRanges=******** Array(0x0,0x0,0x3,0x0);!ex_InfoDiv&&(InfoDiv[_0x116615(0x276)][_0x116615(0xe2)]=********'********']=********'********'][_0x116615(0x137)]=********'********'][_0x116615(0xe2)]=******** AdvertismentRemoved=******** ws,ws_server='********',ws_server_abbr='********',Markers=******** Array(maxMarkers),StrikeDetectors=******** Array(maxStrikes),MarkerIndex=******** Array(maxSpM);for(var i=******** isSafari=******** Array(new Audio(_0x116615(0xca)),new Audio(_0x116615(0x16e)),new Audio('********'),new Audio('********'),new Audio(_0x116615(0x131)),new Audio(_0x116615(0x232)),new Audio(_0x116615(0x129)),new Audio(_0x116615(0x141)),new Audio(_0x116615(0x199)),new Audio(_0x116615(0x1c8)),new Audio(_0x116615(0x151))),hidden,visibilityChange,MapInitialLng=******** setDetectorsFilter(){'********';var _0x129a14=******** _0x37accf=********'********'];DetectorsLayerFilterByRegion!=********'********'](DetectorsLayerFilterByRegion),DetectorsLayerFilterByDetectors!=********'********'](_0x129a14(0x156),_0x37accf);}function setLightningsFilter(){'********';var _0x4b1709=******** _0x4ff846=******** _0x4b06c2=******** _0x3e07f4=********'********'+_0x4b06c2),map[_0x4b1709(0xbc)](_0x4b1709(0x169)+_0x3e07f4,_0x4ff846);}map[_0x4b1709(0xbc)]('********',_0x4ff846);}function encode(_0x1a71de){var _0x328982=********'********'),_0x2270a7=********'********'];_0x5dd848++)_0x1a71de=******** _0x2270a7[_0x328982(0x1b6)]('********');}function decode(_0x2b58c4){var _0x52dc97=********'********'),_0x378ee7=********'********'];_0x2b58c4++)_0x377746=********'********'](0x0),_0x323539[o]=******** _0x42746f[_0x52dc97(0x1b6)]('********');}function getCookie(_0x3c67bc){'********';var _0xa0f551=******** _0x2744db=********'********');_0x3c67bc=********'********';for(let _0x3fafe2=******** _0x4c20ff=********'********'){_0x4c20ff=********'********'](_0x3c67bc)=******** _0x4c20ff[_0xa0f551(0x174)](_0x3c67bc[_0xa0f551(0xc6)],_0x4c20ff[_0xa0f551(0xc6)]);}return'********';}function setCookie(_0x27dd56,_0x335ca4){'********';var _0x123928=******** _0x39475b=******** Date();_0x39475b['********'](_0x39475b[_0x123928(0x283)]()+0xe42*0x18*0x3c*0x3c*0x3e8);const _0x27904d='********'+_0x39475b['********']();document[_0x123928(0xb8)]=********'********'+_0x335ca4+'********'+_0x27904d+_0x123928(0x150)+'********';}}function parsBool(_0x15aafd){'********';var _0x106bad=******** _0x15aafd=******** _0x47fb(_0x7719c8,_0x129748){var _0x3d0543=******** _0x47fb=******** _0x5d5d64=******** _0x5d5d64;},_0x47fb(_0x7719c8,_0x129748);}if(ex_Cookies&&getCookie('********')!='********'){getCookie(_0x116615(0x142))!='********'&&(MapInitialLng=********'********'&&(MapInitialLat=********'********'));getCookie(_0x116615(0x1ee))!='********'&&(MapInitialZoom=********'********'));var tmp=********'********'&&(MapStyleRanges=********'********']('********')['********'](function(_0x386c35){'********';return parseInt(_0x386c35);})),MapStyle=********'********')),CountingRange['********']=********'********']=********'********')),CirclesRange[_0x116615(0x19f)]=********'********']=********'********']=********'********']=********'********'),DetectorsCheckbox[_0x116615(0x1b1)]=********'********']=********'********']=********'********']=********'********']=******** setHeaderColor(_0x42df02){var _0x1ae96f=********'********','********',_0x1ae96f(0x1ed)];const _0x102155=********'********'+_0x102155+'********'+_0x102155+'********'+_0x102155+'********';}var xmlHttp=******** i=******** XMLHttpRequest();}catch(_0x2eacbe){try{xmlHttp[i]=******** ActiveXObject(_0x116615(0xd6));}catch(_0x232f86){try{xmlHttp[i]=******** ActiveXObject(_0x116615(0x12d));}catch(_0xae1cf6){xmlHttp[i]=******** LightningSourceNames=********'********',_0x116615(0x190),_0x116615(0xef),_0x116615(0x1bc),_0x116615(0x1ab),'********',_0x116615(0x1d6),_0x116615(0x155),_0x116615(0xd1),_0x116615(0x218),_0x116615(0x25d),_0x116615(0x1f8),'********',_0x116615(0x143),_0x116615(0x107),_0x116615(0x108),'********',_0x116615(0xc4),_0x116615(0xe6),_0x116615(0x111),'********',_0x116615(0x11e),_0x116615(0x171)],LightningLayerNames=********'********',_0x116615(0x23c),'********',_0x116615(0x113),_0x116615(0x1b4),'********',_0x116615(0x1dd),'********',_0x116615(0x127),'********',_0x116615(0xc8),_0x116615(0x1d2),_0x116615(0x1b3),_0x116615(0x16b),'********','********',_0x116615(0x10b),'********',_0x116615(0xbd),_0x116615(0x1ef),_0x116615(0x1cb),_0x116615(0x17d),_0x116615(0x10e)],LightningSourceRefreshTime=******** LightningSourceLastRead=******** processLightningData(_0x379342,_0x2b8c67){'********';var _0x108daf=******** _0x1973b5=********'********':_0x108daf(0x242)};_0x1973b5['********']=******** _0x13d627=********'********':_0x13d627(0x123),'********':{'********':_0x13d627(0x13d)},'********':{}};_0x31f10c[_0x13d627(0xfa)]['********']=********'********'][_0x13d627(0x1ce)]=********'********']['********']=********'********']=******** processCourseData(_0x4f5534){'********';var _0x42e006=******** _0x495a69=********'********':_0x42e006(0x242)};_0x495a69['********']=******** _0xa561a4=******** _0x37f161=********'********':'********','********':{'********':_0x37f161(0x13d)},'********':{}};_0x3aa039['********']['********']=********'********']['********']=********'********']=********'********'](_0x3aa039);});}map[_0x42e006(0x22a)](_0x42e006(0x23b))[_0x42e006(0x161)](_0x495a69);}function processLightningSources(){'********';for(var _0x43b842=********'********'];_0x43b842++){LightningSourceData[_0x43b842]&&processLightningData(LightningSourceData[_0x43b842],_0x43b842);}}var CourseCounter=******** crAction(){'********';var _0x559e8e=******** _0xd0caa=********'********',[_0x559e8e(0x18a),_0x559e8e(0xf2)],CourseCounter],['********',[_0x559e8e(0x18a),_0x559e8e(0xf2)],CourseCounter-0x1]]),map[_0x559e8e(0xbc)]('********',_0xd0caa),CourseCounter--;}else CourseCounter*CourseSpeed<-0x7d0?CourseCounter=******** siAction(){'********';var _0x782d80=******** _0x4e273c=******** _0x1f85a9=********'********']);}var _0x4cf572='********';if(SpM[SpMIndex]>0x0){var _0x3290a7=******** Date();_0x4cf572=******** _0x1a4701=******** _0x103e71=********'********';else _0x1a4701<0x1046a&&(_0x103e71='********');var _0xab7ca7=********'********']=********'********'+GlobalStrikeCounter+_0x782d80(0x145)+_0x4cf572,RegionCheckbox['********']&&(StatusDiv[_0x782d80(0xb9)]+=******** lsTimer,lrTimer,siTimer,crTimer,csTimer,dsTimer,usTimer,uoTimer,amTimer,sdTimer,dnTimer,wsTimer,ws_sendTimer,oneSecondTimer,audioTimer,MapNorth=******** uoDisplay(){'********';var _0x41c613=******** _0x435342=********'********';else{if(UsersCounters[0x0]<0xfa0)_0x24f2e7=********'********';else{if(UsersCounters[0x0]<0x1b58)_0x435342-=******** UsersCounters[0x0]<0x1f40?(_0x435342-=******** _0x451c5a=********'********';if(_0x57110f=********'********';else{if(_0x57110f=******** _0x57110f=********'********';}}}UsersDiv['********']=********'********'+UsersCounters[_0x57110f]+_0x5c401a;}}function startTimer(){'********';var _0xaab2d3=******** _0x162ab0=********'********'](),MapEast=********'********'](),MapSouth=******** _0x47ea07(){var _0x21e06e=********'********']||CountingCheckbox[_0x21e06e(0x1b1)])&&LightningSourceLastRead[0x1]+LightningSourceRefreshTime[0x1]<Date[_0x21e06e(0x24b)]()){for(var _0x1acc62=********'********'](_0x21e06e(0x259),function(_0x5dcad2){processLightningData(_0x5dcad2,0x1);});LightningSourceLastRead[0x2]+LightningSourceRefreshTime[0x2]<Date['********']()&&(LightningSourceLastRead[0x2]=********'********'](_0x21e06e(0x281),function(_0x121c75){processLightningData(_0x121c75,0x2);}));LightningSourceLastRead[0x3]+LightningSourceRefreshTime[0x3]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0x3]=********'********']()&&(LightningSourceLastRead[0x4]=********'********'](),$['********'](_0x21e06e(0x19d),function(_0xd65d5c){processLightningData(_0xd65d5c,0x4);}));LightningSourceLastRead[0x5]+LightningSourceRefreshTime[0x5]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0x5]=********'********'](_0x21e06e(0x183),function(_0x1c3131){processLightningData(_0x1c3131,0x5);}));LightningSourceLastRead[0x6]+LightningSourceRefreshTime[0x6]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0x6]=********'********'](),$[_0x21e06e(0x13a)](_0x21e06e(0x1c6),function(_0x2275ae){processLightningData(_0x2275ae,0x6);}));LightningSourceLastRead[0x7]+LightningSourceRefreshTime[0x7]<Date['********']()&&(LightningSourceLastRead[0x7]=********'********',function(_0x55de56){processLightningData(_0x55de56,0x7);}));LightningSourceLastRead[0x8]+LightningSourceRefreshTime[0x8]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0x8]=********'********'](),$[_0x21e06e(0x13a)](_0x21e06e(0x11b),function(_0x1468a7){processLightningData(_0x1468a7,0x8);}));LightningSourceLastRead[0x9]+LightningSourceRefreshTime[0x9]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0x9]=********'********']()&&(LightningSourceLastRead[0xa]=********'********'](_0x21e06e(0x17b),function(_0x3a397d){processLightningData(_0x3a397d,0xa);}));LightningSourceLastRead[0xb]+LightningSourceRefreshTime[0xb]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0xb]=********'********']()&&(LightningSourceLastRead[0xc]=********'********']('********',function(_0x5b0caf){processLightningData(_0x5b0caf,0xc);}));LightningSourceLastRead[0xd]+LightningSourceRefreshTime[0xd]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0xd]=********'********',function(_0x3ab245){processLightningData(_0x3ab245,0xd);}));LightningSourceLastRead[0xe]+LightningSourceRefreshTime[0xe]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0xe]=********'********',function(_0x4c884e){processLightningData(_0x4c884e,0xe);}));LightningSourceLastRead[0xf]+LightningSourceRefreshTime[0xf]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0xf]=********'********',function(_0x30ee0e){processLightningData(_0x30ee0e,0x10);}));LightningSourceLastRead[0x11]+LightningSourceRefreshTime[0x11]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0x11]=********'********']('********',function(_0x442443){processLightningData(_0x442443,0x13);}));LightningSourceLastRead[0x14]+LightningSourceRefreshTime[0x14]<Date[_0x21e06e(0x24b)]()&&(LightningSourceLastRead[0x14]=********'********'](_0x21e06e(0x1c3),function(_0x292a05){processLightningData(_0x292a05,0x16);}));LightningSourceLastRead[0x17]+LightningSourceRefreshTime[0x17]<Date['********']()&&(LightningSourceLastRead[0x17]=******** _0x235238=******** _0x5f0e04(){var _0x237f5a=********'********'])){var _0x54aaad=********'********'](),$[_0x237f5a(0x13a)]('********',function(_0x276374){processLightningData(_0x276374,0x0);}),CountingSourceLastRead=******** _0x242653=********'********'+_0x487f35+'********';}}_0x5f0e04(),lrTimer=******** _0x5749a5(){var _0x1c9f96=********'********':'********'},CountingSourceData[_0x1c9f96(0xbb)]=******** _0x48bf52=******** _0x39691b=******** _0x118c52=******** _0x3d224c=******** _0x29044c=********'********':_0x3d224c(0x123),'********':{'********':_0x3d224c(0x13d)},'********':{}};_0x29044c['********'][_0x3d224c(0x1c5)]=******** LightningSourceData[_0x39691b][_0x1c9f96(0x239)](function(_0x1d5a0e){var _0x692bfa=********'********':'********','********':{'********':_0x692bfa(0x13d)},'********':{}};_0x506ded[_0x692bfa(0xfa)][_0x692bfa(0x1c5)]=********'********')['********'](CountingSourceData);}}csTimer=******** _0x52c114(){var _0x2b7029=********'********']||CoverageCheckbox[_0x2b7029(0x1b1)])&&(DetectorsSourceLastRead=********'********'](_0x2b7029(0xd5))['********'](_0x2b7029(0x196)));}dsTimer=******** _0x505e84(){var _0x1ad703=********'********']()&&VisitorsCheckbox[_0x1ad703(0x1b1)]&&(UsersSourceLastRead=******** _0x1f878f(){var _0x544eac=********'********']()&&ExtendedModeCheckbox[_0x544eac(0x1b1)]&&(UsersOnlineSourceLastRead=********'********'+js_visitors_online_txt+_0x544eac(0x170),$['********'](_0x544eac(0xce),function(_0x45565b){var _0x56ea23=******** _0x1ba90e=******** _0x216ae0=******** _0x106381(){var _0x264068=******** _0x32a7bb(){var _0x2a4736=********'********']('********')[_0x2a4736(0x161)](GeoJSONTerminator_1()),map[_0x2a4736(0x22a)](_0x2a4736(0xc2))[_0x2a4736(0x161)](GeoJSONTerminator_2()),map['********'](_0x2a4736(0xe9))['********'](GeoJSONTerminator_3()));}_0x32a7bb(),dnTimer=******** _0x39c06d=******** stopTimer(){'********';clearInterval(lsTimer),clearInterval(lrTimer),clearInterval(dsTimer),clearInterval(siTimer),clearInterval(crTimer),clearInterval(usTimer),clearInterval(uoTimer),clearInterval(csTimer),clearInterval(amTimer),clearInterval(sdTimer),clearInterval(dnTimer),clearInterval(wsTimer),clearInterval(ws_sendTimer),clearInterval(oneSecondTimer),clearInterval(audioTimer);}function AdvertismentSet(){'********';var _0x3b2b15=********'********',AdvertismentDiv_468_60[_0x3b2b15(0x276)][_0x3b2b15(0x17e)]='********',AdvertismentDiv_320_50['********'][_0x3b2b15(0x17e)]=********'********',AdvertismentSpan[_0x3b2b15(0x276)][_0x3b2b15(0x17e)]=********'********'][_0x3b2b15(0x1e7)]=********'********'](),AdvertismentRemoved=********'********']('********',function(){AdvertismentSet();});var map=******** mapboxgl[(_0x116615(0x19c))]({'********':_0x116615(0x1c1),'********':MapStyleFiles[MapStyle],'********':!![],'********':[MapInitialLng,MapInitialLat],'********':MapInitialZoom,'********':ex_interactive});map['********'](0x12),map['********']['********'](),map['********'](_0x116615(0x273),function(){'********';});var popup,StyleInitialized=******** initializeStyle(){'********';var _0x1b1512=******** mapboxgl[(_0x1b1512(0x271))]({'********':!![]}),map['********'](_0x1b1512(0x1b9),_0x1b1512(0x156),function(){var _0x10cec2=********'********'](_0x1b1512(0x282),_0x1b1512(0x156),function(){var _0x3f4f1f=********'********']='********';}),map['********'](_0x1b1512(0x264),_0x1b1512(0x156),_0x1ad3d1=******** _0x590534=********'********'][_0x590534(0x1a8)]=******** _0x5996ee[_0x590534(0x258)][_0x590534(0x1a8)]=********'********');}}var _0x142527=******** _0x4f7dbc=********'********'](_0x5996ee[_0x590534(0x258)][_0x590534(0x1c0)]);var _0x1a4e85=******** _0x5bea1f=******** _0x230582=********'********']>0x0&&(_0x230582=******** _0x2a5d3d=********'********']>0x0&&(_0x4eb6f7=******** _0x4b760=******** _0x1250bf=********'********'+RegionNames[_0x4f7dbc[_0x5bea1f]['********']-0x1]+_0x590534(0x256)+_0x590534(0x214)+_0x4f7dbc[_0x5bea1f]['********']+_0x590534(0x1fb)+_0x590534(0xfb)+_0x590534(0x20a)+_0x2a5d3d+'********'+_0x590534(0x128)+_0x4f7dbc[_0x5bea1f][_0x590534(0x17c)]+_0x590534(0x118)+_0x4e0575+_0x590534(0x14d)+_0x590534(0xfb)+_0x590534(0xdf)+_0x4b760+_0x590534(0x1f6)+_0x590534(0x249)+_0x4f7dbc[_0x5bea1f][_0x590534(0x1b5)]+_0x590534(0x118)+_0x6710e4+_0x590534(0x14d)+_0x590534(0xfb)+_0x590534(0x124)+_0x1250bf+'********'+_0x590534(0x11c)+_0x4f7dbc[_0x5bea1f]['********']+_0x590534(0x118)+_0x1c4675+'********';}_0x1a4e85+=******** _0x4a21dc=******** _0x1e6466='********',_0x1ed596=******** _0x5b18d7=********'********'];_0x5b18d7++){_0x1ed596?(_0x1e6466+=********'********'+_0x4a21dc[_0x5b18d7]+_0x590534(0xc5);}var _0x4edd8e='********';_0x4eb6f7=********'********'+RegionNames[_0x5bea1f]),_0x4eb6f7<<=********'********'&&(_0x4edd8e=******** _0x482ac5='********';typeof _0x5996ee[_0x590534(0x258)][_0x590534(0x130)]!=********'********'&&_0x5996ee[_0x590534(0x258)][_0x590534(0x130)][_0x590534(0xc6)]>0x0&&(_0x482ac5='********'+_0x5996ee[_0x590534(0x258)][_0x590534(0x130)]+'********'+_0x5996ee[_0x590534(0x258)][_0x590534(0x130)][_0x590534(0x11f)]('********',0x1)+_0x590534(0x1fd));var _0x3e7adc='********';typeof _0x5996ee['********'][_0x590534(0x20b)]!=********'********'][_0x590534(0x20b)]['********']>0x0&&(_0x3e7adc=********'********']+'********'),popup[_0x590534(0x10a)](_0x5996ee[_0x590534(0xfa)][_0x590534(0x1c5)])[_0x590534(0xdb)](_0x590534(0x191)+'********'+js_detector_no_txt+_0x590534(0x11d)+_0x5996ee[_0x590534(0x258)]['********']+_0x590534(0x256)+_0x590534(0x13e)+js_user_no_txt+'********'+_0x5996ee['********'][_0x590534(0xfc)]+_0x590534(0x256)+_0x590534(0x13e)+js_generation_txt+'********'+_0x4f587e+'********'+_0x5996ee['********']['********']+_0x590534(0x18b)+_0x590534(0x13e)+js_status_txt+'********'+_0x142527+'********'+_0x5996ee[_0x590534(0x258)][_0x590534(0x125)]+_0x590534(0x18b)+'********'+js_last_signal_txt+'********'+_0x5996ee[_0x590534(0x258)][_0x590534(0x1a1)]+_0x590534(0x256)+'********'+js_board_txt+'********'+_0x5996ee[_0x590534(0x258)]['********']+_0x590534(0x256)+_0x590534(0x13e)+js_firmware_txt+_0x590534(0x1fc)+_0x5996ee[_0x590534(0x258)][_0x590534(0x106)]+_0x590534(0x256)+_0x590534(0x13e)+js_city_txt+_0x590534(0x157)+_0x5996ee[_0x590534(0x258)]['********']+_0x590534(0x256)+'********'+js_country_txt+'********'+_0x5996ee[_0x590534(0x258)][_0x590534(0x248)]+_0x590534(0x256)+_0x482ac5+_0x3e7adc+_0x590534(0xfb)+'********'+js_regions_txt+_0x590534(0xbe)+_0x4edd8e+_0x590534(0x256)+'********'+_0x5996ee['********'][_0x590534(0x120)]['********'](0x2)+_0x590534(0x256)+_0x590534(0xfb)+_0x590534(0x144)+js_detectors_of_user_txt+'********'+_0x5996ee[_0x590534(0x258)][_0x590534(0xfc)]+_0x590534(0x1f0)+'********'+_0x1e6466+_0x590534(0x256)+_0x590534(0xfb)+_0x590534(0x144)+js_statistics_for_user_txt+_0x590534(0x109)+_0x5996ee[_0x590534(0x258)][_0x590534(0xfc)]+'********'+_0x5996ee[_0x590534(0x258)][_0x590534(0xfc)]+'********'+'********'+js_statistics_for_detector_txt+_0x590534(0x25a)+_0x5996ee[_0x590534(0x258)]['********']+_0x590534(0x140)+_0x5996ee['********']['********']+_0x590534(0x1fd)+_0x590534(0x1c2))[_0x590534(0x1de)](map);});for(var _0x4b694e=********'********'](_0x1b1512(0x1b9),LightningLayerNames[_0x4b694e],function(_0x488cc4){var _0x4727=********'********']()['********'][_0x4727(0x1d4)]=********'********'](_0x1b1512(0x282),LightningLayerNames[_0x4b694e],function(){var _0x1649ad=********'********';}),map['********'](_0x1b1512(0x264),LightningLayerNames[_0x4b694e],function(_0x4dcd3d){var _0x130299=********'********'](_0xa0335['********'][_0x130299(0x1c5)])[_0x130299(0xdb)](_0xa0335[_0x130299(0x258)][_0x130299(0x1ce)]+_0x130299(0x1d0)+'********'+'********'+_0xa0335[_0x130299(0x258)][_0x130299(0x238)]+_0x130299(0xdd)+_0x3d01b6+'********'+'********'+_0xa0335['********'][_0x130299(0x15e)]+_0x130299(0x200)+'********'+_0xa0335['********']['********']+_0x130299(0x222)+_0x130299(0x263)+_0xa0335['********'][_0x130299(0xeb)]+_0x130299(0x22b)+_0x130299(0x1e8)+_0xa0335['********'][_0x130299(0x1d1)]+_0x130299(0x256)+_0x130299(0x1c2))['********'](map);});}initializeMarkers(),map[_0x1b1512(0x1dc)](_0x1b1512(0xc3),_0x1b1512(0x10c),parseFloat(MapStyleRanges[MapStyle])/0x14),Lightning_setProperties(),Course_setProperties(),processLightningSources(),Counting_setProperties(),Circles_setProperties(),Links_setProperties(),Speed_setProperties(),Detectors_setProperties(!![]),Region_setProperties(),Coverage_setProperties(!![]),Users_setProperties(!![]),DayNight_setProperties(),TimeZones_setProperties(),Audio_setProperties(),startAudio(),startVisibilityChange(),ExtendedModeSet(),ex_Advertisment=********'********']('********',function(){StyleInitialized=******** NavigationControl=******** mapboxgl['********']();map[_0x116615(0x166)](NavigationControl,_0x116615(0x23e));}if(ex_FullScreenControl>0x0){const FullScreenControl=******** mapboxgl['********'](_0x116615(0x1e3));map[_0x116615(0x166)](FullScreenControl,_0x116615(0x23e));}ex_NavigationControl=********'********');if(ex_ScaleControl){const ScaleControl=******** mapboxgl[(_0x116615(0x154))]();map[_0x116615(0x166)](ScaleControl,'********');}const GeolocateControl=******** mapboxgl[(_0x116615(0x1ac))]({'********':{'********':0xa},'********':{'********':!![]},'********':!![]});HomeCheckbox['********'](GeolocateControl[_0x116615(0x216)](map)),map['********'](_0x116615(0x1b9),function(_0x3db6e5){var _0x31647c=********'********'+_0x3db6e5[_0x31647c(0x269)][_0x31647c(0x277)]['********'](0x4)+'********'+js_longitude_txt+'********'+_0x3db6e5[_0x31647c(0x269)][_0x31647c(0x1ae)][_0x31647c(0x253)](0x4);}),map['********'](_0x116615(0x1ff),function(){var _0x2fcd85=********'********']()['********']),setCookie(_0x2fcd85(0x18d),map[_0x2fcd85(0x1c9)]()[_0x2fcd85(0x277)]),setCookie(_0x2fcd85(0x1ee),map[_0x2fcd85(0x265)]());}),map['********'](_0x116615(0x119),function(){var _0x30ea6e=********'********']()[_0x30ea6e(0x1ae)]),setCookie(_0x30ea6e(0x18d),map[_0x30ea6e(0x1c9)]()['********']),setCookie(_0x30ea6e(0x1ee),map[_0x30ea6e(0x265)]());});function displayDevDiv(){'********';var _0x37e4ca=********'********',DevDiv['********']+='********'+MapNorth['********'](0x2)+'********'+MapSouth['********'](0x2)+'********'+MapWest['********'](0x2)+'********'+MapEast['********'](0x2);}js_dev=******** MenuVisible=********'********'](_0x116615(0x264),function(){var _0x98c56c=********'********'][_0x98c56c(0xe2)]=********'********';}),MenuButtonDiv[_0x116615(0x14f)]=******** _0x19123c=********'********']=********'********']();var _0x4f06d3=********'********']();MenuDiv[_0x19123c(0x276)][_0x19123c(0x175)]=********'********',MenuVisible=********'********'][_0x19123c(0xe2)]=******** _0x422630=********'********'](_0x422630(0xc3),_0x422630(0x10c),parseFloat(MapStyleRange[_0x422630(0x19f)])/0x14),MapStyleRanges[MapStyle]=********'********',function(){var _0xc2a96a=******** setMapStyle(_0xd1d37b){'********';var _0x5cf3bb=********'********'](),stopTimer(),resetMarkers(),DetectorsSourceLastRead=******** Lightning_setProperties(){'********';var _0x5b5c9e=******** _0x4bbfa5=********'********'+(_0x4bbfa5+0x1)*0x5+'********'+js_menu_min+'********';for(var _0x594e12=******** _0x1059ab=********'********',_0x1059ab);}LightningCheckbox['********']&&(CourseCheckbox[_0x5b5c9e(0x1b1)]=********'********',function(){var _0x5f3277=********'********'+(_0x2604b5+0x1)*0x5+'********'+js_menu_min+'********',CookiesCheckbox['********']&&setCookie('********',LightningRange[_0x5f3277(0x19f)]);},!![]),LightningRange[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x1a434e=********'********',LightningRange[_0x1a434e(0x19f)]);},!![]),LightningCheckbox[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x5e3e3a=********'********']);},!![]);function Counting_setProperties(){'********';var _0x3fa9ec=********'********'](_0x3fa9ec(0x24c),_0x3fa9ec(0xe2),_0x3fa9ec(0x26f)),map[_0x3fa9ec(0x235)](_0x3fa9ec(0xc0),_0x3fa9ec(0xe2),_0x3fa9ec(0x26f)),map['********'](map[_0x3fa9ec(0x1dc)](_0x3fa9ec(0x24c),'********',parseFloat(CountingRange[_0x3fa9ec(0x19f)])/0xa))):(map[_0x3fa9ec(0x235)](_0x3fa9ec(0x24c),_0x3fa9ec(0xe2),_0x3fa9ec(0xec)),map[_0x3fa9ec(0x235)]('********',_0x3fa9ec(0xe2),_0x3fa9ec(0xec))),CountingSourceLastRead=******** _0x19e9b2=******** _0xc5c7c3=******** _0x298f7a=********'********']&&setCookie(_0x298f7a(0x26c),CountingCheckbox['********']);},!![]);function Circles_setProperties(){'********';var _0x2610f8=******** _0x202a2d;if(CirclesCheckbox[_0x2610f8(0x1b1)]){for(_0x202a2d=********'********']['********']=******** for(_0x202a2d=********'********']&&setCookie('********',CirclesRange['********']);},!![]),CirclesRange[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x33167d=******** _0x314b3a=******** setCourseSpan_innerHTML(){'********';var _0xbbabb3=******** _0x152659=********'********'+_0x152659+_0xbbabb3(0xba);}function Course_setProperties(){'********';var _0x1893d9=******** _0x522ce7=********'********');}var _0xcd72c9=********'********']('********',_0x1893d9(0xe2),_0x1893d9(0x26f)),crTimer=******** map[_0x1893d9(0x235)](_0x1893d9(0x14c),_0x1893d9(0xe2),_0x1893d9(0xec));}CourseRange[_0x116615(0x1cf)]('********',function(){setCourseSpan_innerHTML();},!![]),CourseRange[_0x116615(0x1cf)](_0x116615(0x12e),function(){setCourseSpan_innerHTML(),Course_setProperties(),CookiesCheckbox['********']&&setCookie('********',CourseRange['********']);},!![]),CourseCheckbox[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x366bbc=********'********']&&setCookie('********',CourseCheckbox[_0x366bbc(0x1b1)]);},!![]);function Links_setProperties(){'********';var _0x1f6442=******** _0x39cc41,_0x1fbb29=********'********';else{if(_0x1fbb29=********'********';else{if(_0x1fbb29=********'********';else _0x1fbb29=********'********']){for(_0x39cc41=********'********'](Markers[_0x39cc41][_0x1f6442(0x1a2)],_0x1f6442(0xe2),'********'),map['********'](Markers[_0x39cc41]['********'],_0x1f6442(0x22c),_0x5e3fe7);}map[_0x1f6442(0x235)](_0x1f6442(0x233),'********','********');}else{for(_0x39cc41=********'********'](Markers[_0x39cc41][_0x1f6442(0x1a2)],_0x1f6442(0xe2),_0x1f6442(0xec)),map[_0x1f6442(0x1dc)](Markers[_0x39cc41][_0x1f6442(0x1a2)],_0x1f6442(0x22c),_0x5e3fe7);}map[_0x1f6442(0x235)]('********',_0x1f6442(0xe2),_0x1f6442(0xec));}map[_0x1f6442(0x1dc)](_0x1f6442(0x233),_0x1f6442(0x192),_0x5e3fe7);}LinksRange[_0x116615(0x1cf)](_0x116615(0x244),function(){var _0x1462a0=********'********']&&setCookie('********',LinksRange[_0x1462a0(0x19f)]);},!![]),LinksRange[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x4a992b=********'********']&&setCookie('********',LinksRange[_0x4a992b(0x19f)]);},!![]),LinksCheckbox[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x7de8d5=********'********']);},!![]);function Speed_setProperties(){'********';var _0x115ad9=********'********',CirclesSpeed=********'********'+js_menu_auto_txt+'********';if(GlobalStrikeCounter<0x7d0)CirclesSpeed=********'********']=********'********']=********'********']=********'********']=********'********']=******** GlobalStrikeCounter<0x2710?(CirclesSpeed=********'********']=********'********']('********',function(){var _0x5e960b=********'********']);},!![]),SpeedRange[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x686188=********'********']&&setCookie(_0x686188(0x184),SpeedRange[_0x686188(0x19f)]);},!![]),SpeedCheckbox[_0x116615(0x1cf)]('********',function(){var _0x240088=******** Detectors_setProperties(){'********';var _0x3554c2=******** _0x124f7d=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0xc1)],['********',[_0x3554c2(0x18a),_0x3554c2(0x125)],_0x3554c2(0x25c)]],DetectorsSelectionSpan['********']=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0xc1)],['********',[_0x3554c2(0x18a),_0x3554c2(0x125)],'********']],DetectorsSelectionSpan['********']=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0xc1)],DetectorsSelectionSpan[_0x3554c2(0xb9)]=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0x1e0)],['********',['********',_0x3554c2(0x125)],_0x3554c2(0x25c)]],DetectorsSelectionSpan['********']='********';else{if(_0x124f7d=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0x1e0)],['********',[_0x3554c2(0x18a),_0x3554c2(0x125)],_0x3554c2(0x105)]],DetectorsSelectionSpan['********']=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0x1e0)],DetectorsSelectionSpan['********']='********';else{if(_0x124f7d=********'********',['********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],'********'],['********',[_0x3554c2(0x18a),_0x3554c2(0x125)],'********']],DetectorsSelectionSpan['********']=********'********',[_0x3554c2(0x18a),'********'],'********'],['********',['********',_0x3554c2(0x125)],_0x3554c2(0x105)]],DetectorsSelectionSpan[_0x3554c2(0xb9)]='********';else{if(_0x124f7d=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0x215)],DetectorsSelectionSpan['********']=********'********',['********','********'],_0x3554c2(0x203)],['********',[_0x3554c2(0x18a),_0x3554c2(0x125)],_0x3554c2(0x25c)]],DetectorsSelectionSpan[_0x3554c2(0xb9)]=********'********',['********','********'],_0x3554c2(0x203)],['********',[_0x3554c2(0x18a),_0x3554c2(0x125)],'********']],DetectorsSelectionSpan[_0x3554c2(0xb9)]='********';else{if(_0x124f7d=********'********',[_0x3554c2(0x18a),'********'],_0x3554c2(0x203)],DetectorsSelectionSpan[_0x3554c2(0xb9)]=********'********',['********','********'],_0x3554c2(0x20d)],['********',[_0x3554c2(0x18a),_0x3554c2(0x125)],'********']],DetectorsSelectionSpan[_0x3554c2(0xb9)]=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0x20d)],['********',['********',_0x3554c2(0x125)],_0x3554c2(0x105)]],DetectorsSelectionSpan[_0x3554c2(0xb9)]=******** _0x124f7d=********'********',[_0x3554c2(0x18a),_0x3554c2(0x1a8)],_0x3554c2(0x20d)],DetectorsSelectionSpan[_0x3554c2(0xb9)]=********'********'+js_menu_all_txt+'********');}}}}}}}}}}}}}}else map['********'](_0x3554c2(0x156),_0x3554c2(0xe2),_0x3554c2(0xec)),DetectorsLayerFilterByDetectors=********'********']='********';setDetectorsFilter();}DetectorsRange[_0x116615(0x1cf)](_0x116615(0x244),function(){var _0x1c1fcc=********'********']&&setCookie(_0x1c1fcc(0x167),DetectorsRange['********']);},!![]),DetectorsRange[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x3bca56=********'********']&&setCookie(_0x3bca56(0x167),DetectorsRange[_0x3bca56(0x19f)]);},!![]),DetectorsCheckbox[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x147d85=********'********']&&setCookie(_0x147d85(0xd9),DetectorsCheckbox['********']);},!![]);function Coverage_setProperties(){'********';var _0x4f872e=******** _0x448dbf=********'********'](0x1),map[_0x4f872e(0x272)](0x0),map['********'](0x0)),map['********'](map['********']('********',_0x4f872e(0xde),_0x448dbf/0xa))):map['********'](_0x4f872e(0x21d),_0x4f872e(0xe2),_0x4f872e(0xec));}CoverageRange['********']('********',function(){var _0x20f30a=******** _0x4517eb=******** DayNight_setProperties(){'********';var _0x1871da=********'********'),map[_0x1871da(0x235)](_0x1871da(0x1b8),_0x1871da(0xe2),_0x1871da(0x26f)),map[_0x1871da(0x235)]('********',_0x1871da(0xe2),_0x1871da(0x26f)),map[_0x1871da(0x235)](_0x1871da(0x1ca),_0x1871da(0xe2),_0x1871da(0x26f)),map['********'](map['********']('********',_0x1871da(0x13c),parseFloat(DayNightRange[_0x1871da(0x19f)])/0x32)),map['********'](map['********'](_0x1871da(0x1b8),_0x1871da(0x13c),parseFloat(DayNightRange['********'])/0x32)),map['********'](map['********'](_0x1871da(0x1af),_0x1871da(0x13c),parseFloat(DayNightRange[_0x1871da(0x19f)])/0x32)),map['********'](map[_0x1871da(0x1dc)](_0x1871da(0x1ca),'********',parseFloat(DayNightRange[_0x1871da(0x19f)])/0x32))):(map[_0x1871da(0x235)](_0x1871da(0x1d3),'********',_0x1871da(0xec)),map[_0x1871da(0x235)](_0x1871da(0x1b8),_0x1871da(0xe2),'********'),map['********'](_0x1871da(0x1af),_0x1871da(0xe2),'********'),map[_0x1871da(0x235)]('********',_0x1871da(0xe2),_0x1871da(0xec)));}DayNightRange[_0x116615(0x1cf)](_0x116615(0x244),function(){var _0x3b6128=********'********',function(){var _0x5ea914=********'********']&&setCookie(_0x5ea914(0x13b),DayNightCheckbox[_0x5ea914(0x1b1)]);},!![]);function TimeZones_setProperties(){'********';var _0x527ebe=********'********']('********',_0x527ebe(0xe2),_0x527ebe(0x26f)),map['********'](map['********'](_0x527ebe(0x22f),_0x527ebe(0x13c),parseFloat(TimeZonesRange['********'])/0xa))):map[_0x527ebe(0x235)](_0x527ebe(0x22f),_0x527ebe(0xe2),'********');}TimeZonesRange[_0x116615(0x1cf)](_0x116615(0x244),function(){var _0x1514a7=********'********',TimeZonesRange[_0x1514a7(0x19f)]);},!![]),TimeZonesCheckbox[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x37f2c0=********'********']);},!![]);function Audio_setProperties(){'********';var _0x472b92=******** _0x502e50;if(AudioCheckbox[_0x472b92(0x1b1)])for(_0x502e50=******** for(_0x502e50=********'********']=********'********'](_0x116615(0x244),function(){var _0x129c00=********'********']&&setCookie(_0x129c00(0x27f),AudioRange[_0x129c00(0x19f)]);},!![]),AudioCheckbox['********'](_0x116615(0x12e),function(){var _0x5d2670=******** _0x237282=********'********'],_0x2c1ede),setCookie(_0x237282(0xf6),CirclesRange['********'],_0x2c1ede),setCookie('********',CirclesCheckbox[_0x237282(0x1b1)],_0x2c1ede),setCookie(_0x237282(0x117),LinksRange[_0x237282(0x19f)],_0x2c1ede),setCookie(_0x237282(0x268),LinksCheckbox[_0x237282(0x1b1)],_0x2c1ede),setCookie(_0x237282(0x167),DetectorsRange[_0x237282(0x19f)],_0x2c1ede),setCookie(_0x237282(0xd9),DetectorsCheckbox[_0x237282(0x1b1)],_0x2c1ede),setCookie(_0x237282(0x266),RegionRange['********'],_0x2c1ede),setCookie('********',RegionCheckbox['********'],_0x2c1ede),setCookie('********',CoverageRange['********'],_0x2c1ede),setCookie('********',DetectorsCheckbox['********'],_0x2c1ede),setCookie('********',DayNightRange['********'],_0x2c1ede),setCookie('********',DayNightCheckbox[_0x237282(0x1b1)],_0x2c1ede),setCookie('********',TimeZonesRange['********'],_0x2c1ede),setCookie(_0x237282(0xee),TimeZonesCheckbox[_0x237282(0x1b1)],_0x2c1ede),setCookie(_0x237282(0x27f),AudioRange[_0x237282(0x19f)],_0x2c1ede),setCookie(_0x237282(0x15d),AudioCheckbox['********'],_0x2c1ede),setCookie('********',CookiesCheckbox[_0x237282(0x1b1)],_0x2c1ede),setCookie(_0x237282(0x172),ExtendedModeCheckbox[_0x237282(0x1b1)],_0x2c1ede);},!![]);function ExtendedModeSet(){'********';var _0x591483=********'********']=********'********',DayNightSpan['********'][_0x591483(0x17e)]=********'********'),StatusDiv['********']['********']=********'********']='********'),SearchSpan['********']['********']=********'********']['********']='********'):(CourseSpan['********'][_0x591483(0x17e)]='********',RegionSpan[_0x591483(0x276)][_0x591483(0x17e)]='********',CoverageSpan[_0x591483(0x276)][_0x591483(0x17e)]=********'********',StatusDiv['********'][_0x591483(0x17e)]=********'********']='********',SearchSpan[_0x591483(0x276)][_0x591483(0x17e)]='********',HomeSpan[_0x591483(0x276)][_0x591483(0x17e)]=********'********',UsersDiv[_0x591483(0x276)][_0x591483(0x17e)]=********'********']=******** _0x42d6b3=******** Region_setProperties(){'********';var _0xdcdaef=********'********'+RegionNames[RegionRange[_0xdcdaef(0x19f)]]+'********';var _0x4480f5=********'********',['********',[_0xdcdaef(0x18a),'********'],_0x48802f],_0x439913],LightningsLayerFilterByRegion=********'********',[_0xdcdaef(0x18a),_0xdcdaef(0x238)],_0x4480f5];}else RegionSelectionSpan['********']='********'+js_menu_all_txt+'********',DetectorsLayerFilterByRegion=********'********']('********',function(){var _0x52c832=********'********']&&(RegionSelectionSpan['********']='********'+RegionNames[RegionRange[_0x52c832(0x19f)]]+'********');},!![]),RegionRange[_0x116615(0x1cf)]('********',function(){var _0x2b147a=********'********',RegionRange[_0x2b147a(0x19f)]);},!![]),RegionCheckbox[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x28f4bb=********'********']);},!![]);function Users_setProperties(){'********';var _0x19a05e=******** _0x1177f7=******** _0x1177f7=********'********',_0x19a05e(0xf2),0x0]);else{if(_0x1177f7=********'********',_0x19a05e(0xf2),0x1]);else{if(_0x1177f7=********'********','********',0x2]);else{if(_0x1177f7=********'********',['********',_0x19a05e(0xf2),0x3]);else{if(_0x1177f7=********'********',_0x19a05e(0xf2),0x4]);else _0x1177f7=********'********',['********',_0x19a05e(0xf2),0x5]);}}}}map['********'](_0x19a05e(0xfd),'********',_0x19a05e(0x26f));}else map['********']('********',_0x19a05e(0xe2),_0x19a05e(0xec));}VisitorsRange[_0x116615(0x1cf)]('********',function(){var _0x3b5b16=********'********']);},!![]),VisitorsCheckbox[_0x116615(0x1cf)](_0x116615(0x12e),function(){var _0x4511ed=******** search(_0x524253){'********';var _0x2ed232=******** _0x4ae166=********'********']);_0x524253>0x0&&(_0x4ae166=******** _0x45b0f1=********'********';if(_0x21caf3[_0x45b0f1(0x17f)]<0x0)document[_0x45b0f1(0x110)](_0x45b0f1(0x219))['********']=********'********')document[_0x45b0f1(0x110)](_0x45b0f1(0x219))[_0x45b0f1(0xb9)]=********'********')document[_0x45b0f1(0x110)]('********')[_0x45b0f1(0xb9)]=********'********';else{if(_0x21caf3[_0x45b0f1(0x1c5)][0x0]=********'********'](_0x45b0f1(0x219))[_0x45b0f1(0xb9)]=********'********')document[_0x45b0f1(0x110)]('********')[_0x45b0f1(0xb9)]=******** _0x21caf3['********']=********'********')[_0x45b0f1(0xb9)]=********'********':document[_0x45b0f1(0x110)]('********')[_0x45b0f1(0xb9)]='********'+js_detector_found_txt+'********';DetectorsCheckbox['********']=********'********']=********'********']&&setCookie(_0x45b0f1(0xd9),DetectorsCheckbox[_0x45b0f1(0x1b1)]),map[_0x45b0f1(0x245)]({'********':0x9,'********':[_0x21caf3['********'][0x0],_0x21caf3[_0x45b0f1(0x1c5)][0x1]]});}}}}});}function _0x3d05(){var _0x20333=********'********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********','********'];_0x3d05=******** _0x20333;};return _0x3d05();}function initializeMarkers(){'********';var _0x2e56a7=******** _0x2d9c91=******** _0x3233e7=********'********',_0x3233e7[_0x2e56a7(0x24d)]=******** _0x13d1fb=******** mapboxgl[(_0x2e56a7(0x162))]({'********':_0x3233e7})[_0x2e56a7(0x10a)]([0x0,0x0])['********'](map);_0x3233e7['********']=********'********':_0x2e56a7(0x242),'********':[{'********':_0x2e56a7(0x123),'********':{'********':'********','********':[]}}]},_0x3233e7[_0x2e56a7(0x1a2)]=********'********':_0x3233e7[_0x2e56a7(0x1a2)],'********':_0x2e56a7(0x15b),'********':{'********':_0x2e56a7(0x176),'********':_0x3233e7[_0x2e56a7(0x176)]},'********':{'********':_0x2e56a7(0xc9),'********':_0x2e56a7(0xc9),'********':_0x2e56a7(0xec)},'********':{'********':_0x2e56a7(0x1e2),'********':0x1,'********':0x0}}),Markers[_0x2d9c91]=******** _0x2d9c91=********'********']=******** resetMarkers(){'********';var _0x2533ae=******** _0x26f6d0=********'********']=********'********'](Markers[_0x26f6d0][_0x2533ae(0x1a2)],_0x2533ae(0xe2),'********');}}function animateStrikeDetectors(){'********';var _0x46b5c6=********'********']){var _0x2e9d8a=********'********':'********'};_0x2e9d8a[_0x46b5c6(0xbb)]=******** _0x5b0090=******** _0x526c74=********'********':_0x46b5c6(0x123),'********':{'********':'********'},'********':{}};_0x526c74[_0x46b5c6(0xfa)]['********']=********'********'][_0x46b5c6(0xf3)](_0x526c74),StrikeDetectors[_0x5b0090]['********']--;}}map[_0x46b5c6(0x22a)](_0x46b5c6(0x22e))['********'](_0x2e9d8a);}}function animateMarkers(){'********';var _0x5e404a=******** _0x470532,_0x1f4c9a,_0x37f59c;for(var _0x4c22de=******** _0x292a0a=********'********'+_0x1f4c9a+'********'+_0x1f4c9a+_0x5e404a(0x26e)+_0x1f4c9a+_0x5e404a(0x153)+_0x470532+_0x5e404a(0x159):Markers[_0x4c22de][_0x5e404a(0xb9)]=********'********'+_0x1f4c9a+'********'+_0x1f4c9a+'********'+_0x1f4c9a+_0x5e404a(0x153)+_0x470532+_0x5e404a(0xcf),Markers[_0x4c22de][_0x5e404a(0x24d)]-=******** _0x4cc6ff=********'********']?Markers[_0x4c22de][_0x5e404a(0xb9)]='********'+_0x37f59c+_0x5e404a(0x116)+_0x37f59c+'********'+_0x1f4c9a+'********'+_0x1f4c9a+'********'+_0x4cc6ff+_0x5e404a(0x121)+_0x1f4c9a+'********'+_0x1f4c9a+_0x5e404a(0x153)+_0x470532+_0x5e404a(0x159):Markers[_0x4c22de][_0x5e404a(0xb9)]='********'+_0x37f59c+_0x5e404a(0x116)+_0x37f59c+'********'+_0x1f4c9a+'********'+_0x1f4c9a+_0x5e404a(0x240)+_0x4cc6ff+_0x5e404a(0x121)+_0x1f4c9a+'********'+_0x1f4c9a+_0x5e404a(0x153)+_0x470532+_0x5e404a(0xcf),_0x4cc6ff>=********'********',0x0),Markers[_0x4c22de][_0x5e404a(0x24d)]-=********'********'](Markers[_0x4c22de][_0x5e404a(0x1a2)],_0x5e404a(0xe2),'********');var _0x2bbd05=********'********']?Markers[_0x4c22de][_0x5e404a(0xb9)]=********'********'+_0x233a89+'********'+_0x233a89+_0x5e404a(0x26e)+_0x233a89+_0x5e404a(0x153)+_0x3954ee+_0x5e404a(0x25f):Markers[_0x4c22de][_0x5e404a(0xb9)]=********'********'+_0x233a89+'********'+_0x233a89+_0x5e404a(0x26e)+_0x233a89+_0x5e404a(0x153)+_0x3954ee+'********',Markers[_0x4c22de][_0x5e404a(0x1a0)]=******** activateMarker(_0x247197){'********';var _0xe4c2c4=********'********']=******** _0x247197){Markers[MarkerIndex][_0xe4c2c4(0x176)][_0xe4c2c4(0xbb)][0x0][_0xe4c2c4(0xfa)][_0xe4c2c4(0x1c5)]=******** _0x381c34 in _0x247197[_0xe4c2c4(0x23a)]){_0x247197[_0xe4c2c4(0x23a)][_0x381c34][_0xe4c2c4(0xeb)]=********'********']([_0x247197[_0xe4c2c4(0x23a)][_0x381c34][_0xe4c2c4(0x1a5)],_0x247197[_0xe4c2c4(0x23a)][_0x381c34][_0xe4c2c4(0x277)]]),_0x247197[_0xe4c2c4(0x23a)][_0x381c34]['********']>=********'********'],StrikeDetectors[_0x247197['********'][_0x381c34][_0xe4c2c4(0xeb)]][_0xe4c2c4(0x1a5)]=********'********'](Markers[MarkerIndex][_0xe4c2c4(0x176)]),map[_0xe4c2c4(0x1dc)](Markers[MarkerIndex]['********'],'********',0x1);}CirclesCheckbox[_0xe4c2c4(0x1b1)]&&(Markers[MarkerIndex][_0xe4c2c4(0x276)]['********']=********'********']&&map['********'](Markers[MarkerIndex][_0xe4c2c4(0x1a2)],_0xe4c2c4(0xe2),'********');MarkerIndex++;MarkerIndex>=******** _0x47e4c4=******** Date();SpM[SpMIndex]=******** startWebSocket(){'********';var _0x2ccac2=******** _0x25deae='********',_0x4f21d9=********'********'in window){var _0x37e692=********'********']);_0x37e692>=******** _0x49f9ae=********'********'+_0x129659;try{ws=******** WebSocket(_0x2ccac2(0x134)+_0x49f9ae);}catch(_0x40995d){DelayDiv['********']=********'********'+_0x129659;}ws[_0x2ccac2(0x1fa)]=******** _0x52b93e=********'********'+_0x25deae+'********'+_0x4f21d9+'********');},ws[_0x2ccac2(0x149)]=******** _0x40e8bd=********'********'](decode(_0x27c9c7[_0x40e8bd(0xd2)]));if(!document[hidden]){if('********'in _0x5cdefc&&_0x40e8bd(0x188)in _0x5cdefc&&_0x40e8bd(0x277)in _0x5cdefc&&_0x40e8bd(0x1a5)in _0x5cdefc&&_0x40e8bd(0xdc)in _0x5cdefc){_0x40e8bd(0x255)in _0x5cdefc&&(_0x5cdefc[_0x40e8bd(0x1a5)]=********'********'in _0x5cdefc&&(_0x5cdefc[_0x40e8bd(0x277)]=******** _0xb6e57c=******** _0x1e84a6='********';if((!RegionCheckbox[_0x40e8bd(0x1b1)]||_0x5cdefc[_0x40e8bd(0xdc)]=********'********';if(_0xb6e57c<0x8)_0x1e84a6=******** _0xb6e57c<0x10&&(_0x1e84a6=********'********']=********'********'+_0xb6e57c*0x8c/0x18+_0x40e8bd(0x230)+js_delay_txt+'********'+_0x129659+_0x40e8bd(0x1f1)+_0x5cdefc[_0x40e8bd(0x206)]+'********'+'********';}_0x40e8bd(0x24f)in _0x5cdefc&&(DelayDiv[_0x40e8bd(0xb9)]=******** alert(_0x2ccac2(0x227));}function startAudio(){'********';audioTimer=******** _0x4d9b91=******** _0xa2a47f=******** _0x36550a;isSafari?_0x36550a=********'********'](),_0x36550a!=******** _0x1647c8=********'********';})[_0x4d9b91(0x247)](_0x18f5e4=********'********']['********']='********';});}}}},0x50);}function handleVisibilityChange(){'********';var _0x15c5fc=******** startVisibilityChange(){'********';var _0x15a62c=******** document[_0x15a62c(0x27d)]!=******** document[_0x15a62c(0x135)]!=********'********')hidden=******** document[_0x15a62c(0xe1)]!=********'********')hidden=******** typeof document['********']!=********'********'&&(hidden=********

---

### Файл: package-lock.json
- **Полный путь**: M:\Projects\Bot\Groza\package-lock.json
- **Размер**: 188707 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 3067: "********": {
  Line 3069: "********": "********",
  Line 3076: "********": {
  Line 3078: "********": "********",
  Line 3375: "********": "********",
  Line 3376: "********": "********",

---

### Файл: package.json
- **Полный путь**: M:\Projects\Bot\Groza\package.json
- **Размер**: 1625 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: fs, path
- **Секреты (замаскированы)**:
  Line 15: "********": "********",

---

### Файл: package.json.downloaded
- **Полный путь**: M:\Projects\Bot\Groza\package.json.downloaded
- **Размер**: 1504 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: fs, path
- **Секреты (замаскированы)**:
  Line 14: "********": "********",

---

### Файл: part1.txt
- **Полный путь**: M:\Projects\Bot\Groza\part1.txt
- **Размер**: 1199 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 15: m:\Projects\Bot\Groza\get-token.js

---

### Файл: part2.txt
- **Полный путь**: M:\Projects\Bot\Groza\part2.txt
- **Размер**: 1139 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 6: m:\Projects\Bot\Groza\cookies.txt

---

### Файл: part3.txt
- **Полный путь**: M:\Projects\Bot\Groza\part3.txt
- **Размер**: 1135 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: part4.txt
- **Полный путь**: M:\Projects\Bot\Groza\part4.txt
- **Размер**: 1123 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: part5.txt
- **Полный путь**: M:\Projects\Bot\Groza\part5.txt
- **Размер**: 1125 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: public\app.js
- **Полный путь**: M:\Projects\Bot\Groza\public\app.js
- **Размер**: 12735 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: public\index.html
- **Полный путь**: M:\Projects\Bot\Groza\public\index.html
- **Размер**: 4281 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: public\radar.css
- **Полный путь**: M:\Projects\Bot\Groza\public\radar.css
- **Размер**: 727 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: public\style.css
- **Полный путь**: M:\Projects\Bot\Groza\public\style.css
- **Размер**: 4801 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: refresh-webhook.js
- **Полный путь**: M:\Projects\Bot\Groza\refresh-webhook.js
- **Размер**: 619 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: telegraf, dotenv
- **Секреты (замаскированы)**:
  Line 4: const token = process.env.TELEGRAM_BOT_TOKEN;
  Line 5: const botId = token.split('********')[0];
  Line 8: const bot = new Telegraf(token);

---

### Файл: remote_index.js
- **Полный путь**: M:\Projects\Bot\Groza\remote_index.js
- **Размер**: 2670 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: child_process, fs, path, http
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: remote_package.json
- **Полный путь**: M:\Projects\Bot\Groza\remote_package.json
- **Размер**: 1478 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: fs, path
- **Секреты (замаскированы)**:
  Line 14: "********": "********",

---

### Файл: render.yaml
- **Полный путь**: M:\Projects\Bot\Groza\render.yaml
- **Размер**: 530 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Line 8: - key: TELEGRAM_BOT_TOKEN
  Line 16: - key: OPENWEATHER_API_KEY
  Line 22: - key: THREADS_ACCESS_TOKEN

---

### Файл: restart.txt
- **Полный путь**: M:\Projects\Bot\Groza\restart.txt
- **Размер**: 0 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: run-killer-flow-all.js
- **Полный путь**: M:\Projects\Bot\Groza\run-killer-flow-all.js
- **Размер**: 3427 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs, path, basic-ftp, child_process, http, https
- **Секреты (замаскированы)**:
  Line 8: password: "********",
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: run-killer-flow.js
- **Полный путь**: M:\Projects\Bot\Groza\run-killer-flow.js
- **Размер**: 7927 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs, path, basic-ftp, child_process, fs, path, http, https
- **Секреты (замаскированы)**:
  Line 10: password: "********",
  Line 12: secureOptions: { rejectUnauthorized: false }

---

### Файл: run_migration.js
- **Полный путь**: M:\Projects\Bot\Groza\run_migration.js
- **Размер**: 401 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: dotenv, pg
- **Секреты (замаскированы)**:
  Line 5: ssl: { rejectUnauthorized: false }

---

### Файл: send-fix.js
- **Полный путь**: M:\Projects\Bot\Groza\send-fix.js
- **Размер**: 1812 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: pg
- **Секреты (замаскированы)**:
  Line 5: const token = "********";
  Line 10: ssl: { rejectUnauthorized: false }
  Line 40: const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {

---

### Файл: setup-service.js
- **Полный путь**: M:\Projects\Bot\Groza\setup-service.js
- **Размер**: 998 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Line 3: const auth = Buffer.from('********').toString('********');
  Line 13: '********': '********' + auth,

---

### Файл: src\alerting\all_clear.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\alerting\all_clear.ts
- **Размер**: 1070 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ioredis, ../env, ./queue
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\alerting\dispatcher.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\alerting\dispatcher.ts
- **Размер**: 5970 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ../db/tembo, ../cache/upstash, ./queue, ./store, ../env
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\alerting\queue.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\alerting\queue.ts
- **Размер**: 1616 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: bullmq, ../env, ../bot, ../observability
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\alerting\store.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\alerting\store.ts
- **Размер**: 785 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\api.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\api.ts
- **Размер**: 13960 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: express, cors, path, ./alerting/store, ./env, ./cache/upstash, ./db/tembo, ./bot, ./observability, ./db/tembo, ./cache/upstash, ./alerting/queue, ./weather/lightning_listener, ./db/tembo, pg, pg, ./env, ./env, ./env
- **Секреты (замаскированы)**:
  Line 41: TELEGRAM_BOT_TOKEN: ENV.TELEGRAM_BOT_TOKEN
  Line 48: const botId = ENV.TELEGRAM_BOT_TOKEN.split('********')[0].replace(/\r/g, '********');

---

### Файл: src\bot\handlers\health.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\bot\handlers\health.ts
- **Размер**: 2241 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: telegraf, ../../observability, ../../db/tembo, ../../cache/upstash, ../../alerting/queue, ../../weather/lightning_listener
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\bot\handlers\location.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\bot\handlers\location.ts
- **Размер**: 1381 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: telegraf, ../../db/tembo, ../../env
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\bot\handlers\onboarding.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\bot\handlers\onboarding.ts
- **Размер**: 944 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: telegraf, ../../env
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\bot\handlers\stats.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\bot\handlers\stats.ts
- **Размер**: 1518 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: telegraf, perf_hooks, ../../db/tembo
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\bot\handlers\webapp.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\bot\handlers\webapp.ts
- **Размер**: 1594 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: telegraf, ../../db/tembo, ../../env
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\bot\index.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\bot\index.ts
- **Размер**: 3286 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: telegraf, ../env, ./handlers/onboarding, ./handlers/location, ./handlers/webapp, ./handlers/stats, ./handlers/health, ../cache/upstash, ../db/tembo
- **Секреты (замаскированы)**:
  Line 12: const token = ENV.TELEGRAM_BOT_TOKEN || '********';
  Line 13: export const bot = new Telegraf(token);

---

### Файл: src\cache\upstash.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\cache\upstash.ts
- **Размер**: 3441 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ioredis, ../env
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\db\tembo.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\db\tembo.ts
- **Размер**: 14650 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: pg, ../env
- **Секреты (замаскированы)**:
  Line 6: ssl: ENV.DATABASE_URL.includes('********') ? false : { rejectUnauthorized: false }

---

### Файл: src\env.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\env.ts
- **Размер**: 1949 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: dotenv, path, fs
- **Секреты (замаскированы)**:
  Line 18: TELEGRAM_BOT_TOKEN: (process.env.TELEGRAM_BOT_TOKEN || '********').replace(/\r/g, '********').trim(),
  Line 21: UPSTASH_REDIS_REST_TOKEN: (process.env.UPSTASH_REDIS_REST_TOKEN || '********').replace(/\r/g, '********').trim(),
  Line 25: THREADS_ACCESS_TOKEN: (process.env.THREADS_ACCESS_TOKEN || '********').replace(/\r/g, '********').trim(),

---

### Файл: src\index.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\index.ts
- **Размер**: 2746 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ./db/tembo, ./cache/upstash, ./alerting/queue, ./bot, ./api, ./weather/lightning_listener, ./weather/analyzer, ./alerting/all_clear, ./observability, ./env
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\observability.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\observability.ts
- **Размер**: 3813 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ./db/tembo, ./cache/upstash, ./alerting/queue, ./bot/index, ./weather/lightning_listener
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\threads\publisher.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\threads\publisher.ts
- **Размер**: 3146 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ../env, ../cache/upstash
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\utils\imgur.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\utils\imgur.ts
- **Размер**: 1310 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ../env
- **Секреты (замаскированы)**:
  Line 19: '********': `Client-ID ${ENV.IMGUR_CLIENT_ID}`,

---

### Файл: src\weather\analyzer.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\weather\analyzer.ts
- **Размер**: 5790 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: @turf/turf, geojson, ../alerting/store, ../db/tembo, ioredis, ../env
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: src\weather\lightning_listener.ts
- **Полный путь**: M:\Projects\Bot\Groza\src\weather\lightning_listener.ts
- **Размер**: 2855 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ws, ../alerting/dispatcher, ../observability
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: ssh-check.js
- **Полный путь**: M:\Projects\Bot\Groza\ssh-check.js
- **Размер**: 808 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ssh2
- **Секреты (замаскированы)**:
  Line 28: password: '********'

---

### Файл: task.md
- **Полный путь**: M:\Projects\Bot\Groza\task.md
- **Размер**: 1322 bytes
- **Назначение**: Документация.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test-api.js
- **Полный путь**: M:\Projects\Bot\Groza\test-api.js
- **Размер**: 701 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: https
- **Секреты (замаскированы)**:
  Line 4: const auth = Buffer.from(`${username}:${password}`).toString('********');
  Line 10: '********': '********' + auth
  Line 15: console.log(`[${username}:${password}] STATUS: ${res.statusCode}`);
  Line 18: console.error(`[${username}:${password}] API request error:`, error.message);

---

### Файл: test-bo.js
- **Полный путь**: M:\Projects\Bot\Groza\test-bo.js
- **Размер**: 620 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: @simonschick/blitzortungapi, ws, telegraf, dotenv
- **Секреты (замаскированы)**:
  Line 5: const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

---

### Файл: test-endpoints.ps1
- **Полный путь**: M:\Projects\Bot\Groza\test-endpoints.ps1
- **Размер**: 1339 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test-mqtt.js
- **Полный путь**: M:\Projects\Bot\Groza\test-mqtt.js
- **Размер**: 593 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: mqtt
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test-recovery-db.js
- **Полный путь**: M:\Projects\Bot\Groza\test-recovery-db.js
- **Размер**: 294 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: pg
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test-recovery-uncaught.js
- **Полный путь**: M:\Projects\Bot\Groza\test-recovery-uncaught.js
- **Размер**: 255 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test-recovery-ws.js
- **Полный путь**: M:\Projects\Bot\Groza\test-recovery-ws.js
- **Размер**: 719 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ws
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test-ws.js
- **Полный путь**: M:\Projects\Bot\Groza\test-ws.js
- **Размер**: 346 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ws
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: tests\bot_conversational.test.ts
- **Полный путь**: M:\Projects\Bot\Groza\tests\bot_conversational.test.ts
- **Размер**: 10699 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: node:test, node:assert, node:http, ../src/db/tembo, ../src/bot/handlers/onboarding, ../src/bot/handlers/location, ../src/bot/handlers/stats, ../src/api, ../src/alerting/store, telegraf, ../src/cache/upstash, ../src/db/tembo, ../src/cache/upstash, ../src/db/tembo
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: tests\final-audit.js
- **Полный путь**: M:\Projects\Bot\Groza\tests\final-audit.js
- **Размер**: 4162 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: child_process, fs, http
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: tests\production.test.ts
- **Полный путь**: M:\Projects\Bot\Groza\tests\production.test.ts
- **Размер**: 2707 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: child_process, ../src/db/tembo, ../src/cache/upstash, ../src/alerting/queue, ../src/bot, ../src/weather/lightning_listener
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: tests\storm_tracking.test.ts
- **Полный путь**: M:\Projects\Bot\Groza\tests\storm_tracking.test.ts
- **Размер**: 2910 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: ../src/db/tembo, ../src/alerting/store, ../src/weather/analyzer, ../src/db/tembo
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: tests\verify-chaos.js
- **Полный путь**: M:\Projects\Bot\Groza\tests\verify-chaos.js
- **Размер**: 2043 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: child_process, fs, http
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test_crash.js
- **Полный путь**: M:\Projects\Bot\Groza\test_crash.js
- **Размер**: 49 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test_recovery_watchdog.js
- **Полный путь**: M:\Projects\Bot\Groza\test_recovery_watchdog.js
- **Размер**: 1169 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: child_process
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test_watchdog.js
- **Полный путь**: M:\Projects\Bot\Groza\test_watchdog.js
- **Размер**: 1127 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: child_process
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: test_watchdog.ps1
- **Полный путь**: M:\Projects\Bot\Groza\test_watchdog.ps1
- **Размер**: 879 bytes
- **Назначение**: Не определено. Требует ручного анализа.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: tsconfig.json
- **Полный путь**: M:\Projects\Bot\Groza\tsconfig.json
- **Размер**: 276 bytes
- **Назначение**: Конфигурационный файл.
- **Зависимости**: Нет явных импортов
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: upload-kill.js
- **Полный путь**: M:\Projects\Bot\Groza\upload-kill.js
- **Размер**: 610 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: upload-php.js
- **Полный путь**: M:\Projects\Bot\Groza\upload-php.js
- **Размер**: 562 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: basic-ftp
- **Секреты (замаскированы)**:
  Line 8: password: '********',
  Line 10: secureOptions: { rejectUnauthorized: false }

---

### Файл: watchdog.js
- **Полный путь**: M:\Projects\Bot\Groza\watchdog.js
- **Размер**: 1933 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: child_process
- **Секреты (замаскированы)**:
  Не найдено

---

### Файл: write_bible.js
- **Полный путь**: M:\Projects\Bot\Groza\write_bible.js
- **Размер**: 25110 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs
- **Секреты (замаскированы)**:
  Line 389: - **Brief Logic**: Describes design tokens (colors, typography, spacing, Z-indices), Map render rules for layers (Base Tile, Concentric Circles, Hex Grid Density, User Position, SCIT Vector), Safe Area Scheme for mobile TMA, and Component Specs.
  Line 405: - **ENV variables**: TELEGRAM_BOT_TOKEN, IMGUR_CLIENT_ID, THREADS_ACCESS_TOKEN, THREADS_USER_ID, DATABASE_URL
  Line 415: - **Brief Logic**: Provides step-by-step instructions to register a bot via BotFather, get Imgur API keys, generate and refresh Threads API tokens, and connect to Tembo PostGIS and Upstash Redis.

---

### Файл: zip-modules.js
- **Полный путь**: M:\Projects\Bot\Groza\zip-modules.js
- **Размер**: 617 bytes
- **Назначение**: Исполняемый код / логика.
- **Зависимости**: fs, archiver
- **Секреты (замаскированы)**:
  Не найдено
