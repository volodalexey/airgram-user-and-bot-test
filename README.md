## Setup

- create telegram Bot with [BotFather](https://telegram.me/botfather)
- create telegram group, add created before Bot to this group, assign this bot as administrator so it can see messages of each other (in group settings - enable administrators and force set administrator enabled for Bot)
- define chat id of previously created group. The simplest way to define chat id is to open your chat in [Web Telegram](https://web.telegram.org). In URL you will see something like this `https://web.telegram.org/#/im?p=g310758602` - it means your chat id is `310758602` (or more common to name chat id with minus sign: `-310758602`)
- create `.apprc` file in the root directory with following content:

```
api_id = 1...9
api_hash = a...z
phone_number = 1...9
bot_token = 1...9a...z
chat_id = 1...9
```

## Steps

// run only once
- `npm i`
- `npm run build`
- `npm run authorize-user`
- `npm run authorize-bot`

// run multiple times
- `npm run test`
