import { FollowEvent } from '@line/bot-sdk';
import { lineClient } from '@mizuyari-bot-nodejs/common';
import { createUser } from '../services/userCreationService';
import { initialReply } from './replies/initialReply';

// フォローされたイベントを検知したら、ユーザーを作成もしくは更新し、初期メッセージを返す
export const handleFollowEvent = async (event: FollowEvent) => {
  await createUser(event.source.userId!);

  await lineClient.replyMessage(
    event.replyToken,
    initialReply('フォローありがとうございます。', '以下のメニューから操作を', '開始してください。'),
  );
};
