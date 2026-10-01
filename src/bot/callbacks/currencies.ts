import { Context, InlineKeyboard } from "grammy";
import { Assest, getAssets } from "../services/market.service.js";
import { ASSET_CATEGORIES } from "../config/assets.js";

export async function currenciesHandler(ctx: Context) {
if (ctx.callbackQuery) {
  await ctx.answerCallbackQuery();
}
  const assets = await getAssets();

  const currencies = assets.filter((asset: Assest) =>
    ASSET_CATEGORIES.currencies.includes(asset.code as any),
  );

  const message =
    "💵 <b>نرخ ارز</b>\n\n" +
    currencies
      .map((currency: Assest) => {
        const name = currency.labelFa.split(" / ")[0];

        const price = new Intl.NumberFormat("fa-IR", {
          maximumFractionDigits: 0,
        }).format(currency.value / 10);

        return `💰 <b>${name}</b>\n   ${price} تومان`;
      })
      .join("\n\n");

  const keyboard = new InlineKeyboard().text("🔙 بازگشت", "back");

  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}
