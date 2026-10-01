import { Context, InlineKeyboard, SessionFlavor } from "grammy";
import { SessionData } from "../types/session.js";
import { Assest, getAssets } from "../services/market.service.js";

type MyContext = Context & SessionFlavor<SessionData>;

const CONVERSION_PAIRS = {
  TOMAN: ["EUR", "USD", "GBP", "CNY"],
  USD: ["TOMAN", "EUR", "GBP", "CNY"],
  EUR: ["TOMAN", "USD", "GBP", "CNY"],
  GBP: ["TOMAN", "USD", "EUR", "CNY"],
  CNY: ["TOMAN", "USD", "EUR", "GBP"],
} as const;

const CURRENCIES = {
  TOMAN: {
    name: "تومان",
    flag: "🇮🇷",
  },

  USD: {
    name: "دلار",
    flag: "🇺🇸",
  },

  EUR: {
    name: "یورو",
    flag: "🇪🇺",
  },

  GBP: {
    name: "پوند",
    flag: "🇬🇧",
  },

  CNY: {
    name: "یوان",
    flag: "🇨🇳",
  },
} as const;

export async function converterHandler(ctx: Context) {
if (ctx.callbackQuery) {
  await ctx.answerCallbackQuery();
}
  const keyboard = new InlineKeyboard()
    .text("🇮🇷 تومان", "convert_from_TOMAN")
    .row()
    .text("🇺🇸 دلار", "convert_from_USD")
    .text("🇪🇺 یورو", "convert_from_EUR")
    .row()
    .text("🇬🇧 پوند", "convert_from_GBP")
    .text("🇨🇳 یوان", "convert_from_CNY")
    .row()
    .text("🔙 بازگشت", "back");

  await ctx.reply("💱 <b>تبدیل ارز</b>\n\n" + "ارز مبدا را انتخاب کن:", {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}

export async function converterFromHandler(ctx: MyContext) {
  await ctx.answerCallbackQuery();

  const from = (ctx as any).match[1] as keyof typeof CONVERSION_PAIRS;

  ctx.session.converter = {
    from,
  };

  const destinations = CONVERSION_PAIRS[from];

  const keyboard = new InlineKeyboard();

  destinations.forEach((currency, index) => {
    keyboard.text(
      `${CURRENCIES[currency].flag} ${CURRENCIES[currency].name}`,
      `convert_to_${currency}`,
    );

    if (index % 2 === 1) {
      keyboard.row();
    }
  });

  keyboard.row().text("🔙 بازگشت", "converter");

  await ctx.editMessageText(
    `${CURRENCIES[from].flag} <b>${CURRENCIES[from].name}</b> انتخاب شد.\n\n` +
      "حالا ارز مقصد را انتخاب کن:",
    {
      parse_mode: "HTML",
      reply_markup: keyboard,
    },
  );
}

export async function converterToHandler(ctx: MyContext) {
  await ctx.answerCallbackQuery();

  const to = (ctx as any).match[1] as keyof typeof CURRENCIES;

  if (!ctx.session.converter?.from) {
    await ctx.reply("ابتدا ارز مبدا را انتخاب کن.");
    return;
  }

  ctx.session.converter.to = to;
  ctx.session.converter.waitingForAmount = true;

  const from = ctx.session.converter.from;

  await ctx.editMessageText(
    `💱 تبدیل ${CURRENCIES[from].name} به ${CURRENCIES[to].name}\n\n` +
      `مقدار ${CURRENCIES[from].name} را وارد کن:`,
    {
      parse_mode: "HTML",
    },
  );
}

export async function converterAmountHandler(ctx: MyContext) {
  if (!ctx.message?.text) {
    return;
  }

  const converter = ctx.session.converter;

  if (!converter?.from || !converter.to || !converter.waitingForAmount) {
    return;
  }

  const amount = Number(ctx.message.text.replace(/,/g, ""));

  if (!Number.isFinite(amount) || amount <= 0) {
    await ctx.reply("❌ لطفاً یک مبلغ معتبر وارد کن.");
    return;
  }

  const assets = await getAssets();

  const getRate = (currency: string) => {
    if (currency === "TOMAN") {
      return 1;
    }

    const asset = assets.find(
      (item: Assest) => item.code === `${currency}_RLS`,
    );

    if (!asset) {
      throw new Error(`Rate for ${currency} not found`);
    }

    return asset.value / 10;
  };

  const fromRate = getRate(converter.from);
  const toRate = getRate(converter.to);

  const result = (amount * fromRate) / toRate;

  await ctx.reply(
    `💱 <b>نتیجه تبدیل</b>\n\n` +
      `${amount.toLocaleString("fa-IR")} ${CURRENCIES[converter.from].name}\n` +
      `⬇️\n` +
      `${result.toLocaleString("fa-IR", {
        maximumFractionDigits: 0,
      })} ${CURRENCIES[converter.to].name}`,
    {
      parse_mode: "HTML",
    },
  );

  ctx.session.converter = undefined;
}
