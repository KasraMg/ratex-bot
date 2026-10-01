import { Context, InlineKeyboard } from "grammy";
import { Assest, getAssets } from "../services/market.service.js";
import { ASSET_CATEGORIES } from "../config/assets.js";

export async function cryptoHandler(ctx: Context) {
if (ctx.callbackQuery) {
  await ctx.answerCallbackQuery();
}
  const assets = await getAssets();

  const crypto = assets.filter((asset: Assest) =>
    ASSET_CATEGORIES.crypto.includes(asset.code as any),
  );

  const usd = assets.find((asset: Assest) => asset.code === "USD_RLS");

  if (!usd) {
    throw new Error("USD_RLS asset not found");
  }

  const usdToToman = usd.value / 10;

  const message =
    "🪙 <b>ارزهای دیجیتال</b>\n\n" +
    crypto
      .map((coin: Assest) => {
        const name = coin.labelFa.split(" / ")[0];

        const dollarPrice = new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 2,
        }).format(coin.value);

        const tomanPrice = new Intl.NumberFormat("fa-IR", {
          maximumFractionDigits: 0,
        }).format(coin.value * usdToToman);

        return (
          `💰 <b>${name}</b>\n` +
          `   💵 ${dollarPrice} دلار\n` +
          `   🇮🇷 ${tomanPrice} تومان`
        );
      })
      .join("\n\n");

  const keyboard = new InlineKeyboard().text("🔙 بازگشت", "back");

  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}
