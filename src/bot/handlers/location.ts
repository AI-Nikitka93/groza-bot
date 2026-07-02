import { Context, Markup } from 'telegraf';
import { upsertUserLocation } from '../../db/tembo';

export async function handleLocation(ctx: Context) {
  // @ts-ignore - telegraf types for location message can be tricky
  const location = ctx.message?.location;
  if (!location) return;

  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    await upsertUserLocation(userId, location.latitude, location.longitude);
    await ctx.reply('✅ Локация сохранена. Радар активирован. Мы уведомими вас, если гроза окажется в радиусе 15 км.', Markup.removeKeyboard());
  } catch (error) {
    console.error('Error saving location:', error);
    await ctx.reply('❌ Ошибка сохранения локации. Попробуйте еще раз позже.');
  }
}
