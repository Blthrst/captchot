import { NextFunction } from "grammy";
import { Random } from "random-js";

import { CaptchotContext } from "./types";
import { formBotMessage } from "./formBotMessage";
import { config } from "./config";

const r = new Random();

/**
 * Sends a message with an example to be solved to a new chat user. Saves user info in session. Starts timer to ban new user
 */
export async function catchNewChatMember(
  ctx: CaptchotContext,
  next: NextFunction
): Promise<void> {
  if (ctx.message?.new_chat_members) {
    for (const user of ctx.message.new_chat_members) {
      const [first, second] = [r.integer(0, 15), r.integer(0, 15)];
      const result = first + second;

      const preparedMessage = formBotMessage(user, first, second);

      const repliedMsg = await ctx.reply(preparedMessage);

      const timerId = setTimeout(async () => {
        await ctx.deleteMessage();
        await ctx.banChatMember(user.id);
      }, config.TIME_FOR_ANSWER * 1000);

      ctx.session.cache.set(BigInt(user.id), {
        result,
        msg_id: repliedMsg.message_id,
        timerId,
      });
    }
  }
  await next();
}

/**
 * Checks to see if the answer is correct. If true, it removes all restrictions from the user. Otherwise, all messages from the user will be deleted and the user will be banned when the timer expires
 */
export async function checkAnswer(
  ctx: CaptchotContext,
  next: NextFunction
): Promise<void> {
  const correctId = BigInt(ctx.from!.id);
  const cache = ctx.session.cache;

  if (correctId && cache.get(correctId)) {
    const userInfoInSession = cache.get(correctId);

    try {
      if (Number(ctx.message!.text) === userInfoInSession!.result) {
        await ctx.deleteMessages([
          ctx.message!.message_id,
          userInfoInSession!.msg_id,
        ]);
        clearTimeout(userInfoInSession!.timerId);
        cache.delete(correctId);
        return;
      }

      await ctx.deleteMessage();
    } catch (err) {
      console.log(err);
    }
  }

  await next();
}
