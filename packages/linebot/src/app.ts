// dotenvの制約で、最初に読み込む必要がある
import { config } from 'dotenv';
config();
// --
import { WebhookEvent, middleware } from '@line/bot-sdk';
import { lineConfig } from '@mizuyari-bot-nodejs/common';
import express from 'express';
import { isFollowEvent, isPostbackEvent, isTextMessageEvent } from './event.typeGuards';
import { handleFollowEvent } from './handlers/followEventHandler';
import { handlePostbackEvent } from './handlers/postbackEventHandler';
import { handleTextMessageEvent } from './handlers/textMessageHandler';
import { wrap } from './libs/asyncWrapper';
import { errorHandler } from './libs/errorHandler';

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log('Running!');
});

app.get('/', (_, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Connected successfully!',
  });
});

app.post(
  '/webhook', //
  middleware(lineConfig), //
  wrap(async (req, res) => {
    (req.body.events as WebhookEvent[]).forEach(async (event) => {
      if (isTextMessageEvent(event)) {
        await handleTextMessageEvent(event);
      }
      if (isFollowEvent(event)) {
        await handleFollowEvent(event);
      }
      if (isPostbackEvent(event)) {
        await handlePostbackEvent(event);
      }
    });

    res.status(200).end();
  }),
);

app.use(errorHandler);
