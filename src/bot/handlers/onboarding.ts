import { Context, Markup } from 'telegraf';
import { ENV } from '../../env';

export async function handleStart(ctx: Context) {
  const text = `⚡️ Ваш карманный радар безопасности.
Мы ловим каждый удар молнии в реальном времени и бьем тревогу, если разряд произошел ближе 15 км от вас. Никаких абстрактных прогнозов, только факты.

Чтобы бот мог спасти вас от шторма на природе, ему нужно знать, где вы находитесь.

Отправьте свою геолокацию или выберите точку вручную:`;

  await ctx.reply(text, Markup.keyboard([
    [Markup.button.locationRequest('📍 Отправить геолокацию')],
    [Markup.button.webApp('🗺 Карта', ENV.WEBAPP_URL)]
  ]).resize());
}
