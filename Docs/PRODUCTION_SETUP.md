# Пошаговое руководство: Запуск в Production (Zero-Cost Setup)

Этот документ описывает, как получить и настроить все необходимые токены для автономной работы бота и интеграции с Threads, не потратив ни одного доллара.

## 1. Telegram Bot (@BotFather)
1. Откройте Telegram и найдите бота `@BotFather`.
2. Отправьте команду `/newbot` и следуйте инструкциям для создания бота.
3. Скопируйте полученный **HTTP API Token** и вставьте его в `.env` как `TELEGRAM_BOT_TOKEN`.
4. Включите геолокацию: Отправьте `/setinlinegeo`, выберите вашего бота и включите опцию.
5. Настройте WebApp: Отправьте `/newapp`, укажите короткое имя (например, `radar`) и привяжите URL вашего задеплоенного Express-сервера (где крутится статика `public/`).

## 2. Imgur API (Бесплатный хостинг картинок)
Imgur необходим для преобразования локальных карт-буферов в публичные URL (требование API Threads).
1. Перейдите на [Imgur API Registration](https://api.imgur.com/oauth2/addclient).
2. Авторизуйтесь под любым аккаунтом.
3. Выберите **"Anonymous usage without user authorization"**.
4. Укажите любой фиктивный Callback URL.
5. После регистрации вы получите **Client ID**. Вставьте его в `.env` как `IMGUR_CLIENT_ID`.

## 3. Meta Threads Graph API (Автопостинг)
Настройка Threads API — самая сложная часть. Вам понадобится аккаунт Instagram/Threads.

### Шаг 3.1: Создание Meta App
1. Зайдите в [Meta Developer Portal](https://developers.facebook.com/).
2. Нажмите **Create App** -> Выберите **Other** -> **None**.
3. В дашборде найдите продукт **Threads API** и нажмите **Set Up**.

### Шаг 3.2: Получение токенов (User Access Token)
1. Откройте **Threads Use Case** в меню приложения.
2. Воспользуйтесь *User Token Generator*.
3. Авторизуйтесь через аккаунт Instagram, привязанный к вашему профилю Threads.
4. Вы получите **Short-Lived Access Token** (живет 1 час). 

### Шаг 3.3: Обмен на Long-Lived Token
Короткоживущий токен необходимо обменять на токен, живущий 60 дней. Для этого выполните HTTP-запрос (можно прямо в браузере или через `curl`):
```bash
curl -X GET "https://graph.threads.net/v1.0/oauth/access_token?grant_type=th_exchange_token&client_secret=YOUR_META_APP_SECRET&access_token=YOUR_SHORT_LIVED_TOKEN"
```
Ответ будет содержать новый `access_token` (Long-Lived). Вставьте его в `.env` как `THREADS_ACCESS_TOKEN`. 
Ваш ID в Threads можно найти, сделав запрос `GET https://graph.threads.net/v1.0/me?access_token=...`. Вставьте его в `THREADS_USER_ID`.

### Шаг 3.4: Автоматический Refresh токена
Чтобы бот работал вечно, Long-Lived токен необходимо обновлять (рефрешить) до истечения 60 дней. Вы можете вызывать эндпоинт Meta раз в 30 дней с помощью cron:
```bash
curl -X GET "https://graph.threads.net/v1.0/oauth/access_token?grant_type=th_refresh_token&access_token=CURRENT_LONG_LIVED_TOKEN"
```
*Совет: на Serv00 можно добавить bash-скрипт в `crontab`, который делает этот curl-запрос и подменяет токен в `.env` файле, перезапуская Node.js процесс.*

## 4. Развертывание базы данных (Tembo + Redis)
- **Tembo PostGIS:** Зарегистрируйтесь на [Tembo.io](https://tembo.io/), создайте бесплатный инстанс. Скопируйте Connection String в `DATABASE_URL`.
- **Upstash Redis:** Зарегистрируйтесь на [Upstash.com](https://upstash.com/), создайте БД Redis. Скопируйте URL и REST Token в `.env`.

После настройки всех ключей запустите `npm run build` и `node dist/index.js`.
