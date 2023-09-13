import { WebhookEvent, middleware } from '@line/bot-sdk';
import { config } from 'dotenv';
import 'dotenv/config';
import express from 'express';
import { lineConfig } from './config/config';
import { isFollowEvent, isPostbackEvent, isTextMessageEvent } from './event.typeGuards';
import { handleFollowEvent } from './handlers/followEventHandler';
import { handlePostbackEvent } from './handlers/postbackEventHandler';
import { handleTextMessageEvent } from './handlers/textMessageHandler';
import { errorHandler } from './libs/errorHandler';

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
  (req, res) => {
    (req.body.events as WebhookEvent[])
      .map((event) => {
        if (isTextMessageEvent(event)) {
          return handleTextMessageEvent(event);
        }
        if (isFollowEvent(event)) {
          return handleFollowEvent(event);
        }
        if (isPostbackEvent(event)) {
          return handlePostbackEvent(event);
        }

        res.status(200).end();
      })
      .forEach((promise) => {
        promise?.then(() => res.status(200).end()).catch(console.error);
      });
  },
);

app.use(errorHandler);

export { app };
