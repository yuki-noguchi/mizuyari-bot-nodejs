import { FollowEvent } from '@line/bot-sdk';
import { client } from '../libs/client';
import { initialReply } from './replies/initialReply';

export const handleFollowEvent = (event: FollowEvent) => {
  // const userId = event.source.userId;
  // TODO 処理
  client.replyMessage(
    event.replyToken,
    initialReply('フォローありがとうございます。', '以下のメニューから操作を', '開始してください。'),
  );
};
