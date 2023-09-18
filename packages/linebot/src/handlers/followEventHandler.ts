import { FollowEvent } from '@line/bot-sdk';
import { lineClient, prisma } from '@mizuyari-bot-nodejs/common';
import { initialReply } from './replies/initialReply';

export const handleFollowEvent = async (event: FollowEvent) => {
  const userId = event.source.userId;

  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      create: {
        id: userId!,
        status: 'STAND_BY',
      },
      update: {
        status: 'STAND_BY',
      },
      where: {
        id: userId!,
      },
    });
  });
  await lineClient.replyMessage(
    event.replyToken,
    initialReply('フォローありがとうございます。', '以下のメニューから操作を', '開始してください。'),
  );
};