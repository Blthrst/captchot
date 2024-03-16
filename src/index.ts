import { Bot, session } from "grammy";
import { config } from "./config";

import { SessionData } from "./interfaces";

const bot = new Bot(config.BOT_TOKEN);

function initial(): SessionData {
  return { cache: new Map() };
}
bot.use(session({ initial() }));

bot.command("start", async (ctx) => {
  await ctx.reply("test");
});

bot.on("message:new_chat_members", async (ctx, next) => {
  for (const user of ctx.message.new_chat_members) {
    ctx.reply(
      `Hello, ${
        "@" + user.username ?? user.first_name
      }\nYou have 60 seconds to click the button or you'll be banned`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Click me!", callback_data: user.id.toString()}]
            ]
        }
      }
    );
  }
  await next();
});

bot.on("callback_query:data", async (ctx, next) => {
    console.log(ctx)
    
    await next()
})

bot.start();
bot.catch((e) => console.log(e));
