import { Context, Markup } from 'telegraf';
import { upsertUserLocation } from '../../db/tembo';
import { ENV } from '../../env';

export async function handleLocation(ctx: Context) {
  // @ts-ignore - telegraf types for location message can be tricky
  const location = ctx.message?.location;
  if (!location) return;

  const userId = ctx.from?.id;
  if (!userId) return;
  
  const lat = location.latitude;
  const lon = location.longitude;

  try {
    await upsertUserLocation(userId, lat, lon);

    const timestamp = Date.now();
    const userUrl = `${ENV.WEBAPP_URL}?lat=${lat}&lon=${lon}&v=${timestamp}`;
    
    // Update Menu Button per-chat
    try {
      await ctx.setChatMenuButton({
        type: 'web_app',
        text: '🗺 Моя локация',
        web_app: { url: userUrl }
      });
    } catch(e) {
      console.error('Failed to set chat menu button', e);
    }

    await ctx.reply('✅ Локация сохранена. Зона наблюдения до 30 км активирована. Мы уведомим вас при возникновении грозовой угрозы по Индексу Опасности!', Markup.keyboard([Markup.button.webApp('🗺 Моя локация', userUrl)]).resize());
  } catch (error) {
    console.error('Error saving location:', error);
    await ctx.reply('❌ Ошибка сохранения локации. Попробуйте еще раз позже.');
  }
}
