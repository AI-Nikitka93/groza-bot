import { Context } from 'telegraf';
import { performance } from 'perf_hooks';
import { countStrikesNearUser } from '../../db/tembo';

export async function handleStats(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const startTime = performance.now();

  try {
    const count = await countStrikesNearUser(userId);
    
    if (count === null) {
      await ctx.reply(
        '📍 Сначала отправьте свою геолокацию, чтобы мы могли определить ваш регион.\nИспользуйте команду /start или кнопку "📍 Отправить геолокацию".'
      );
    } else {
      await ctx.reply(
        `🌩 *Статистика гроз в вашем регионе (100 км):*\n\n` +
        `За последние 24 часа зарегистрировано ударов молний: *${count}*.\n\n` +
        `Берегите себя! ⚡️`,
        { parse_mode: 'Markdown' }
      );
    }
    
    const durationMs = (performance.now() - startTime).toFixed(2);
    console.log(`[STATS-DEBUG] Handled /stats command for user ${userId} in ${durationMs}ms`);
  } catch (error) {
    const durationMs = (performance.now() - startTime).toFixed(2);
    console.error(`[STATS-DEBUG ERROR] Failed /stats command for user ${userId} after ${durationMs}ms:`, error);
    await ctx.reply('❌ Не удалось получить статистику гроз. Попробуйте позже.');
  }
}
