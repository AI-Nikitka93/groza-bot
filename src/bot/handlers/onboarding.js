"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStart = handleStart;
const telegraf_1 = require("telegraf");
async function handleStart(ctx) {
    const text = `⚡️ Ваш карманный радар безопасности.
Мы следим за молниями вокруг вас и предупредим за 15 минут до удара. Никакой воды, только экстренные уведомления.

Чтобы бот мог спасти вас от грозы, ему нужно знать, где вы находитесь. Данные нигде не хранятся.

Нажмите кнопку ниже, чтобы включить защиту.`;
    // Sending location request keyboard
    await ctx.reply(text, telegraf_1.Markup.keyboard([
        [telegraf_1.Markup.button.locationRequest('📍 Охранять меня по GPS (Live)')]
    ]).resize());
}
//# sourceMappingURL=onboarding.js.map