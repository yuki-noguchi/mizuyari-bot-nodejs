import { FollowEvent } from '@line/bot-sdk';
import { lineClient } from '../libs/lineClient';
import { prisma } from '../libs/prismaClient';
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
  lineClient.replyMessage(
    event.replyToken,
    initialReply('フォローありがとうございます。', '以下のメニューから操作を', '開始してください。'),
  );
};
