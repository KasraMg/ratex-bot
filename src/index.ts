import "dotenv/config";

import { bot } from "./bot.js";
import { getRedis } from "./services/redis.service.js";

await getRedis();
 
console.log("Redis connected...");

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

bot.start();

console.log("RateX bot is running...");
