import { Context, Markup } from 'telegraf';
import { ENV } from '../../env';

export async function handleStart(ctx: Context) {
  const text = `⚡️ Ваш карманный радар безопасности.
Мы ловим каждый удар молнии в реальном времени и рассчитываем Индекс Опасности (Storm Risk Score) в зоне наблюдения до 30 км.

Учитываем скорость фронта, направление движения и время до подхода грозы. Никаких лишних спам-уведомлений — только реальные факты.

Чтобы бот мог вовремя предупредить вас о приближении шторма, укажите вашу точку на карте:`;

  await ctx.reply(text, Markup.keyboard([
    [Markup.button.text('⚡️ Текущий статус'), Markup.button.webApp('🗺️ Радар', ENV.WEBAPP_URL)],
    [Markup.button.text('📍 Изменить локацию'), Markup.button.text('❓ Помощь')]
  ]).resize());
}
