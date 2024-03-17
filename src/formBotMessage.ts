import { config } from "./config";
import { User } from "grammy/types";

/**
 * Forms message that bot will send when new chat member arrive
 * @param user new chat member
 * @param first first random operand
 * @param second second random operand
 * @returns formed message
 */
export function formBotMessage(
  user: User,
  first: number,
  second: number
): string {

  const replies = config.REPLIES.EN;

  return (
    replies.hello +
    ("@" + user.username ?? user.first_name) +
    "\n" +
    replies.youHave +
    config.TIME_FOR_ANSWER +
    replies.solveOrBeBanned +
    replies.writeAnswer +
    `${first} + ${second} ?`
  );
}
