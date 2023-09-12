import { WebhookEvent, middleware } from '@line/bot-sdk';
import { config } from 'dotenv';
import 'dotenv/config';
import express from 'express';
import { lineConfig } from './config/config';
import { isFollowEvent, isPostbackEvent, isTextMessageEvent } from './event.typeGuards';
import { handleFollowEvent } from './handlers/followEventHandler';
import { handlePostbackEvent } from './handlers/postbackEventHandler';
import { handleTextMessageEvent } from './handlers/textMessageHandler';
import { wrap } from './libs/asyncWrapper';

config();

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
    console.log('1');
    await req.body.events.forEach(async (event: WebhookEvent) => {
      console.log('2');
      if (isTextMessageEvent(event)) {
        console.log('3');
        await handleTextMessageEvent(event);
      }
      if (isFollowEvent(event)) {
        console.log('4');
        await handleFollowEvent(event);
      }
      if (isPostbackEvent(event)) {
        console.log('5');
        await handlePostbackEvent(event);
      }
    });

    console.log('6');
    res.status(200).end();
  }),
);

export { app };
