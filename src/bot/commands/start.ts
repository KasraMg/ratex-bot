import { Context, InlineKeyboard } from "grammy";

export function startHandler() {
  return async (ctx: Context) => {
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
    }

    const keyboard = new InlineKeyboard()
      .text("💵 ارزها", "currencies")
      .text("🪙 کریپتو", "crypto")
      .row()
      .text("🥇 طلا و سکه", "gold")
      .text("💱 تبدیل ارز", "converter");

    await ctx.reply(
      "درود 👋\n\n" +
        "به RateX خوش اومدی.\n\n" +
        "نرخ ارز، کریپتو، طلا و سکه رو ببین و ارزها رو به‌سادگی تبدیل کن. 📊\n\n" +
        "یک گزینه رو انتخاب کن:",
      {
        reply_markup: keyboard,
      },
    );
  };
}
