import { Context, InlineKeyboard } from "grammy";
import { Assest, getAssets } from "../services/market.service.js";
import { ASSET_CATEGORIES } from "../config/assets.js";

export async function goldHandler(ctx: Context) {
if (ctx.callbackQuery) {
  await ctx.answerCallbackQuery();
}
  const assets = await getAssets();

  const gold = assets.filter((asset: Assest) =>
    ASSET_CATEGORIES.gold.includes(asset.code as any),
  );

  const usd = assets.find((asset: Assest) => asset.code === "USD_RLS");

  if (!usd) {
    throw new Error("USD_RLS asset not found");
  }

  const usdToToman = usd.value / 10;

  const message =
    "🥇 <b>نرخ طلا و سکه</b>\n\n" +
    gold
      .map((item: Assest) => {
        const name = item.labelFa.split(" / ")[0];

        const isDollarPrice = item.code.endsWith("_USD");

        const tomanPrice = isDollarPrice
          ? item.value * usdToToman
          : item.value / 10;

        const price = new Intl.NumberFormat("fa-IR", {
          maximumFractionDigits: 0,
        }).format(tomanPrice);

        return `💰 <b>${name}</b>\n   ${price} تومان`;
      })
      .join("\n\n");

  const keyboard = new InlineKeyboard().text("🔙 بازگشت", "back");

  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}
