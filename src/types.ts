import { Context, SessionFlavor } from "grammy"

/**
 * Interface of a config that contains in config.yaml
 */
export interface Config {
  BOT_TOKEN: string;
  TIME_FOR_ANSWER: number
  REPLIES: any;
}

/**
 * Session interface
 */
export interface SessionData {
    cache: Map<BigInt, UserInfo>
}

/**
 * Interface of info about new user that contains in session
 */
export type UserInfo = {
    result: number,
    msg_id: number,
    timerId: any
}

/**
 * Custom context for using session
 */
export type CaptchotContext = Context & SessionFlavor<SessionData>;