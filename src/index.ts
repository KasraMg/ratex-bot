import "dotenv/config";
import { Bot, Context, session, SessionFlavor } from "grammy";

import { startHandler } from "./bot/commands/start.js";
import { currenciesHandler } from "./bot/callbacks/currencies.js";
import { cryptoHandler } from "./bot/callbacks/crypto.js";
import { goldHandler } from "./bot/callbacks/gold.js";
import {
  converterHandler,
  converterFromHandler,
  converterToHandler,
  converterAmountHandler,
} from "./bot/callbacks/converter.js";
import { SessionData } from "./bot/types/session.js";

type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

await bot.api.setMyCommands([
  {
    command: "start",
    description: "شروع کار با RateX",
  },
  {
    command: "rates",
    description: "مشاهده نرخ ارزها",
  },
  {
    command: "crypto",
    description: "مشاهده قیمت ارزهای دیجیتال",
  },
  {
    command: "gold",
    description: "مشاهده نرخ طلا و سکه",
  },
  {
    command: "converter",
    description: "تبدیل ارزها",
  },
]);
await bot.api.setChatMenuButton({
  menu_button: {
    type: "commands",
  },
});

bot.use(
  session({
    initial: (): SessionData => ({}),
  }),
);

const start = startHandler();

bot.command("start", start);
bot.command("converter", converterHandler);
bot.command("rates", currenciesHandler);
bot.command("crypto", cryptoHandler);
bot.command("gold", goldHandler);

bot.callbackQuery("currencies", currenciesHandler);
bot.callbackQuery("crypto", cryptoHandler);
bot.callbackQuery("gold", goldHandler);

bot.callbackQuery("converter", converterHandler);

bot.callbackQuery(/^convert_from_(.+)$/, converterFromHandler);
bot.callbackQuery(/^convert_to_(.+)$/, converterToHandler);

bot.on("message:text", converterAmountHandler);

bot.callbackQuery("back", start);

bot.start();

console.log("RateX bot is running...");
