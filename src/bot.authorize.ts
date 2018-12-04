import * as path from "path";
import * as fs from 'fs';

import {createBotConfig} from "./config"
import {createApp, authorizeApp} from "./app";

const botConfig = createBotConfig();
const botApp = createApp(botConfig);
authorizeApp(botApp, botConfig)
  .then(() => {
    const storePath = path.join(__dirname, '../bot.store.json');
    console.dir(fs.readFileSync(storePath, 'utf8'));
  })
  .catch(err => {
  console.error(err);
  process.exit(1);
});