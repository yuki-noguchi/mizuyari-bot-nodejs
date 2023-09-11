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

app.get('/api', (_, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Connected successfully!',
  });
});

app.post(
  '/api/webhook', //
  middleware(lineConfig), //
  wrap(async (req, res) => {
    await req.body.events.forEach(async (event: WebhookEvent) => {
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

export { app };
