"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLocation = handleLocation;
const telegraf_1 = require("telegraf");
const tembo_1 = require("../../db/tembo");
async function handleLocation(ctx) {
    // @ts-ignore - telegraf types for location message can be tricky
    const location = ctx.message?.location;
    if (!location)
        return;
    const userId = ctx.from?.id;
    if (!userId)
        return;
    try {
        await (0, tembo_1.upsertUserLocation)(userId, location.latitude, location.longitude);
        await ctx.reply('✅ Локация сохранена. Радар активирован. Мы уведомими вас, если гроза окажется в радиусе 15 км.', telegraf_1.Markup.removeKeyboard());
    }
    catch (error) {
        console.error('Error saving location:', error);
        await ctx.reply('❌ Ошибка сохранения локации. Попробуйте еще раз позже.');
    }
}
//# sourceMappingURL=location.js.map