import { NextFunction } from "grammy";
import { Random } from "random-js";

import { CaptchotContext } from "./types";

const r = new Random();

export async function catchNewChatMember(
  ctx: CaptchotContext,
  next: NextFunction
) {
  if (ctx.message?.new_chat_members) {
    for (const user of ctx.message.new_chat_members) {
      const [first, second] = [r.integer(0, 10), r.integer(0, 10)];
      const result = first + second;

      const repliedMsg = await ctx.reply(
        `Hello, ${
          "@" + user.username ?? user.first_name
        }\nYou have 60 seconds to solve the problem otherwise you will be banned\nWrite an answer. What is ${first} + ${second} ?`
      );

      const timerId = setTimeout(
        async () => {
            await ctx.banChatMember(user.id);
            await ctx.deleteMessage()
        },
        1000
      );

      ctx.session.cache.set(BigInt(user.id), {
        result,
        msg_id: repliedMsg.message_id,
        timerId,
      });
    }
  }
  await next();
}

export async function checkAnswer(ctx: CaptchotContext, next: NextFunction) {
  const correctId = BigInt(ctx.from!.id);
  const cache = ctx.session.cache;

  if (correctId && cache.get(correctId)) {
    const userInfoInSession = cache.get(correctId);

    if (
      userInfoInSession &&
      Number(ctx.message!.text) === userInfoInSession.result
    ) {
      await ctx.deleteMessages([
        ctx.message!.message_id,
        userInfoInSession.msg_id,
      ]);
      clearTimeout(userInfoInSession.timerId);
      cache.delete(correctId);
      return;
    }

    await ctx.deleteMessage();
  }

  await next();
}
