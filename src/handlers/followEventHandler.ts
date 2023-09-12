import { FollowEvent } from '@line/bot-sdk';
import { lineClient } from '../libs/lineClient';
import { prisma } from '../libs/prismaClient';
import { initialReply } from './replies/initialReply';

export const handleFollowEvent = async (event: FollowEvent) => {
  const userId = event.source.userId;
  console.log('1');

  await prisma
    .$transaction(async (tx) => {
      console.log('2');
      await tx.user
        .upsert({
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
        })
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
  console.log('3');
  await lineClient
    .replyMessage(
      event.replyToken,
      initialReply('フォローありがとうございます。', '以下のメニューから操作を', '開始してください。'),
    )
    .then((r) => console.log(r))
    .catch((e) => console.error(e));
  console.log('4');
};
