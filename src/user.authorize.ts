import * as path from "path";
import * as fs from 'fs';

import {createUserConfig} from "./config"
import {createApp, authorizeApp} from "./app";

const userConfig = createUserConfig();
const userApp = createApp(userConfig);
authorizeApp(userApp, userConfig)
  .then(() => {
    const storePath = path.join(__dirname, '../user.store.json');
    console.dir(fs.readFileSync(storePath, 'utf8'));
  })
  .catch(err => {
  console.error(err);
  process.exit(1);
});