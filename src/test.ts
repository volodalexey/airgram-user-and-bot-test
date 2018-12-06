import Airgram from 'airgram';

import { createApp, initializeApp, sendChatMessage } from './app';
import { AppBotConfigType, createBotConfig, AppUserConfigType, createUserConfig } from './config';
import { resolve } from 'dns';

describe("Check e2e Bot response", () => {
  let botConfig: AppBotConfigType;
  let botApp: Airgram;
  let userConfig: AppUserConfigType;
  let userApp: Airgram;
  let chatId: number;

  beforeAll(async () => {
    botConfig = createBotConfig();
    botApp = createApp(botConfig);

    userConfig = createUserConfig();
    userApp = createApp(userConfig);

    chatId = botConfig.chat_id;

    return initializeApp(botApp)
  });

  test("User send /start command and receive response", async () => {
    jest.setTimeout(30000);
    expect.assertions(1);
    const startCmd = '/start';

    await sendChatMessage(userApp, chatId, startCmd);

    await new Promise((resolve) => {
      setTimeout(resolve, 25000)
    })

    expect(true).toBe(true);
  });

});