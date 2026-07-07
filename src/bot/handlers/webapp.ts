import { Context, Markup } from 'telegraf';
import { upsertUserLocation } from '../../db/tembo';

export async function handleWebAppData(ctx: Context) {
  // @ts-ignore
  const webAppData = ctx.message?.web_app_data?.data;
  if (!webAppData) return;

  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    const data = JSON.parse(webAppData);
    if (data.lat !== undefined && data.lon !== undefined) {
      const lat = Number(data.lat);
      const lon = Number(data.lon);
      await upsertUserLocation(userId, lat, lon);
      await ctx.reply('✅ Локация сохранена. Радар активирован. Мы уведомими вас, если гроза окажется в радиусе 15 км.', Markup.removeKeyboard());
    } else {
      await ctx.reply('❌ Ошибка: получены неверные данные от карты.');
    }
  } catch (error) {
    console.error('Error handling WebApp data:', error);
    await ctx.reply('❌ Ошибка обработки данных. Попробуйте еще раз.');
  }
}
