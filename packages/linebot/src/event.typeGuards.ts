import { FollowEvent, MessageEvent, PostbackEvent, TextEventMessage, WebhookEvent } from '@line/bot-sdk';

export const isTextMessageEvent = (
  event: WebhookEvent,
): event is Omit<MessageEvent, 'message'> & { message: TextEventMessage } =>
  event.type === 'message' && event.message.type === 'text';

export const isFollowEvent = (event: WebhookEvent): event is FollowEvent => event.type === 'follow';

export const isPostbackEvent = (event: WebhookEvent): event is PostbackEvent => event.type === 'postback';
