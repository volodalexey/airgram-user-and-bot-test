import rc = require('rc');
import { type } from 'os';

export type InitialConfigType = {
  api_id: string,
  api_hash: string,
  phone_number: string,
  bot_token: string,
  chat_id: string,
}

export type AppBotConfigType = Pick<InitialConfigType, Exclude<keyof InitialConfigType, "api_id" | "chat_id">> & {
  api_id: number,
  chat_id: number,
}

export type AppUserConfigType = Pick<AppBotConfigType, Exclude<keyof AppBotConfigType, "bot_token" >>

export function toNumber(futureNumber: string | number): number {
  let _number;
  if (typeof futureNumber === 'string') {
    try {
      _number = Number.parseInt(futureNumber)
    } catch (e) {
      throw e
    } finally {
      if (Number.isNaN(_number)) {
        throw new Error(`Can not convert ${futureNumber} to Integer/Number. Result is ${_number}`)
      }
    }
  } else {
    _number = futureNumber
  }
  if (_number < 0) {
    _number = -1 * _number
  }
  return _number
}

export function createBotConfig(name: string = 'app'): AppBotConfigType {
  let config: InitialConfigType = rc(name);
  if (!config.api_id || !config.api_hash || !config.phone_number || 
    !config.bot_token || !config.chat_id) {
    throw new Error('Config must contain: api_id, api_hash, phone_number, bot_token, chat_id !!!')
  }
  const api_id = toNumber(config.api_id);
  const chat_id = toNumber(config.chat_id);
  return {...config, api_id, chat_id}
}

export default createBotConfig

export function createUserConfig(): AppUserConfigType {
  const botConfig = createBotConfig();

  const {bot_token, ...userConfig} = botConfig;

  return userConfig
}