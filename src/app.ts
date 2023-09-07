import { WebhookEvent, middleware } from '@line/bot-sdk';
import 'dotenv/config';
import express from 'express';
import { lineConfig } from './config/config';
import { isFollowEvent, isPostbackEvent, isTextMessageEvent } from './event.typeGuards';
import { handleFollowEvent } from './handlers/followEventHandler';
import { handlePostbackEvent } from './handlers/postbackEventHandler';
import { handleTextMessageEvent } from './handlers/textMessageHandler';

const app = express();

app.listen(process.env.PORT || 3000);

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
    req.body.events.forEach((event: WebhookEvent) => {
      if (isTextMessageEvent(event)) {
        handleTextMessageEvent(event);
      }
      if (isFollowEvent(event)) {
        handleFollowEvent(event);
      }
      if (isPostbackEvent(event)) {
        handlePostbackEvent(event);
      }
    });

    res.status(200);
  },
);
