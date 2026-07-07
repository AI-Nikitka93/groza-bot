# Task List
- [x] Шаг 1: Frontend_Agent (на базе P-FRONTEND) исправляет маркер на карте, чтобы он был перетаскиваемым и обновлял координаты.
- [x] Шаг 2: QA_Agent (на базе P-QAX) проводит верификацию фронтенда и бота.
- [x] Шаг 3: Deploy - запуск `node deploy-public.js` (или deploy-dist.js) для деплоя на Alwaysdata.
- [x] Шаг 4: Обновление AGENTS_HISTORY.md.
- [ ] Шаг 5: Executor-Bot Architect (на базе P-BOTX) исправляет удаление клавиатуры (`Markup.removeKeyboard()`) на постоянную кнопку WebApp в `src/bot/handlers/webapp.ts` и `src/bot/handlers/location.ts`, и добавляет `bot.telegram.setChatMenuButton` в `src/bot/index.ts`.
- [ ] Шаг 6: QA_Judge проверяет тесты бота.
- [ ] Шаг 7: Деплой бота на сервер.
- [ ] Шаг 8: Обновление AGENTS_HISTORY.md.
