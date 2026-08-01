import { Context, Markup } from 'telegraf';
import { upsertUserLocation } from '../../db/tembo';
import { ENV } from '../../env';

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
    } else {
      await ctx.reply('❌ Ошибка: получены неверные данные от карты.');
    }
  } catch (error) {
    console.error('Error handling WebApp data:', error);
    await ctx.reply('❌ Ошибка обработки данных. Попробуйте еще раз.');
  }
}
