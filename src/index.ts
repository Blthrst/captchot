import { Bot, Context, NextFunction, session } from "grammy";
import { config } from "./config";

import { SessionData, CaptchotContext } from "./types";
import { catchNewChatMember, checkAnswer } from "./handlers";

const bot = new Bot<CaptchotContext>(config.BOT_TOKEN);

function initial(): SessionData {
  return { cache: new Map() };
}

bot.use(session({ initial }));

bot.command("start", async (ctx) => {
  await ctx.reply("test");
});

bot.on(
  "message:new_chat_members",
  async (ctx: CaptchotContext, next: NextFunction) =>
    await catchNewChatMember(ctx, next)
);

bot.on(
  "message",
  async (ctx: CaptchotContext, next: NextFunction) =>
    await checkAnswer(ctx, next)
);

bot.start();

process.on("uncaughtException", (error, origin) => {
  console.log(error, origin);
  process.exit(1);
});
