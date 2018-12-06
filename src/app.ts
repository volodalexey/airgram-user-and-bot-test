const promiseFinally = require('promise.prototype.finally');
promiseFinally.shim();
import 'reflect-metadata';
import {Airgram, ag, AuthDialog, TYPES, api} from "airgram";
import DebugLogger from "airgram-debug"
import JSONBotStore from "./bot.store";
import JSONUserStore from "./user.store";
import {getCalleeName, prompt} from "airgram/helpers";
import { AppBotConfigType, AppUserConfigType } from './config';

export function createApp(config: AppBotConfigType | AppUserConfigType): Airgram {
  let airgram: Airgram;
  if ('bot_token' in config) {
    airgram = new Airgram({ id: config.api_id, hash: config.api_hash, token: config.bot_token });
    airgram.bind<JSONBotStore<ag.AuthDoc>>(TYPES.AuthStore).to(JSONBotStore);
    airgram.bind<JSONBotStore<ag.MtpState>>(TYPES.MtpStateStore).to(JSONBotStore);
  } else {
    airgram = new Airgram({ id: config.api_id, hash: config.api_hash });
    airgram.bind<JSONUserStore<ag.AuthDoc>>(TYPES.AuthStore).to(JSONUserStore);
    airgram.bind<JSONUserStore<ag.MtpState>>(TYPES.MtpStateStore).to(JSONUserStore);
  }

  airgram.bind<ag.Logger & { level: string }>(TYPES.Logger).to(DebugLogger)
    .onActivation((context, logger) => {
      logger.namespace = [getCalleeName(context)]
      logger.level = 'debug'
      return logger
    })

  //
  // FIXME: You use `Auth` middleware twice, it is not correctly.
  //
  // const { auth } = airgram;
  //
  // airgram.use(auth);
  //
  // auth.use(new AuthDialog({
  //   firstName: '',
  //   lastName: '',
  //   phoneNumber: config.phone_number,
  //   code: () => prompt('Please input the secret code:'),
  //   samePhoneNumber: ({ phoneNumber }) => prompt(`Do you want to sign in with the "${phoneNumber}" phone number? Y/N`),
  //   continue: ({ phoneNumber }) => prompt(`Do you have the secret code for the "${phoneNumber}" and wish to continue? Y/N`)
  // }));

  return airgram
}

export default createApp

export function initializeApp(airgram: Airgram) {
  const { updates } = airgram;

  function handleNewUpdate(ctx: ag.UpdateContext, next) {
    console.log(`Update type: ${ctx._}`);
    return next()
  }

  updates.use(handleNewUpdate);

  updates.on('updateNewMessage', (ctx, next) => {
    console.log(`New message: ${ctx.update}`)
    return next()
  });

  return updates.startPolling().then(() => {
    console.log('Long polling started')
  })
}

function populateAnswer(answer: string) {
  return !(['N', 'n'].indexOf(answer.charAt(0)) > -1)
}

export function authorizeApp(airgram: Airgram, config: AppBotConfigType | AppUserConfigType) {
  airgram.auth.use(new AuthDialog({
    firstName: '',
    lastName: '',
    phoneNumber: config.phone_number,
    code: () => prompt('Please input the secret code:'),
    samePhoneNumber: ({ phoneNumber }) => prompt(`Do you want to sign in with the "${phoneNumber}" phone number? Y/N`)
      .then(populateAnswer),
    continue: ({ phoneNumber }) => prompt(`Do you have the secret code for the "${phoneNumber}" and wish to continue? Y/N`)
      .then(populateAnswer)
  }));

  return airgram.auth.login()
}

export function sendChatMessage(airgram: Airgram, chat_id: number, text: string): Promise<any> {
  return airgram.client.messages.sendMessage({
    peer: { _: 'inputPeerChat', chat_id: chat_id },
    message: text,
    random_id: Date.now(),
  })
}

export function getLastChatMessage(airgram: Airgram, chat_id: number): Promise<any> {
  return airgram.client.messages.getHistory({
    peer: { _: 'inputPeerChat', chat_id: chat_id },
    add_offset: 0,
    limit: 1,
    max_id: 0,
    min_id: 0,
    offset_date: 0,
    offset_id: 0,
  }).then(data => data.messages[0])
}

export function getDifference(airgram: Airgram) {
  return airgram.updates.getDifference().then((difference: api.UpdatesDifferenceUnion) => {
    console.log('difference:', difference)
  })
}