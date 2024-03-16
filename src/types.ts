import { Context, SessionFlavor } from "grammy"

export interface Config {
    BOT_TOKEN: string
}

export interface SessionData {
    cache: Map<BigInt, UserInfo>
}

export type UserInfo = {
    result: number,
    msg_id: number,
    timerId: any
}

export type CaptchotContext = Context & SessionFlavor<SessionData>;