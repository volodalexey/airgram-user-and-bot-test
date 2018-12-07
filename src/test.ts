import Airgram from 'airgram';

import { createApp, initializeApp, sendChatMessage, getLastChatMessage } from './app';
import { AppBotConfigType, createBotConfig, AppUserConfigType, createUserConfig } from './config';
import { resolve } from 'dns';

describe("Check e2e Bot response", () => {
  let botConfig: AppBotConfigType;
  let botApp: Airgram;
  let userConfig: AppUserConfigType;
  let userApp: Airgram;
  let chatId: number;
  let promiseResolve;
  let botAnswer = new Promise((resolve) => {
    promiseResolve = resolve
  });

  beforeAll(async () => {
    botConfig = createBotConfig();
    botApp = createApp(botConfig);

    userConfig = createUserConfig();
    userApp = createApp(userConfig);

    chatId = botConfig.chat_id;

    botApp.updates.on('updateNewMessage', ({ update }, next) => {
      if (update._ === 'updateNewMessage' && update.message._ === 'message') {
        if (update.message.message === '/start') {
          return next().then(() => {
            promiseResolve();
          })
        }
      }
      return next()
    })

    return initializeApp(botApp);
  });

  test("User send /start command and receive response", async () => {
    jest.setTimeout(30000);
    expect.assertions(1);
    const startCmd = '/start';

    await sendChatMessage(userApp, chatId, startCmd);

    await botAnswer;

    const chatMessage = await getLastChatMessage(userApp, chatId);

    if (chatMessage && chatMessage._ === 'message') {
      expect(chatMessage.message).toBe('I am ready!');
    }
  });

});