import { Context, Markup } from 'telegraf';

export async function handleStart(ctx: Context) {
  const text = `⚡️ Ваш карманный радар безопасности.
Мы следим за молниями вокруг вас и предупредим за 15 минут до удара. Никакой воды, только экстренные уведомления.

Чтобы бот мог спасти вас от грозы, ему нужно знать, где вы находитесь. Данные нигде не хранятся.

Нажмите кнопку ниже, чтобы включить защиту.`;

  // Sending location request in reply keyboard
  await ctx.reply(text, Markup.keyboard([
    [Markup.button.locationRequest('📍 Охранять меня по GPS (Live)')]
  ]).resize());

  // Sending WebApp in inline keyboard
  await ctx.reply('Или выберите точку вручную:', Markup.inlineKeyboard([
    [Markup.button.webApp('🗺 Открыть Карту', process.env.WEBAPP_URL || 'https://google.com')]
  ]));
}
