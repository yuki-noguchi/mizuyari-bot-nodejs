import { MessageEvent, TextEventMessage } from '@line/bot-sdk';
import { lineClient } from '../libs/lineClient';
import { prisma } from '../libs/prismaClient';
import { initialReply } from './replies/initialReply';
import { nextDateInputReply } from './replies/nextDateInputReply';
import { wateringRegistrationReply } from './replies/wateringRegistrationReply';

export const handleTextMessageEvent = async (event: Omit<MessageEvent, 'message'> & { message: TextEventMessage }) => {
  const userId = event.source.userId;

  const user = await prisma.user.findUniqueOrThrow({
    include: {
      waterings: true,
    },
    where: {
      id: userId,
    },
  });

  switch (user.status) {
    case 'STAND_BY': {
      await lineClient.replyMessage(event.replyToken, initialReply());
      break;
    }
    case 'PROCESSING': {
      // 植物名登録待ちだったら
      if (user.waterings.some((watering) => watering.status === 'WAITING_FOR_PLANT_NAME')) {
        if (user.waterings.some((watering) => watering.plantName === event.message.text)) {
          await lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text: 'すでに登録されている植物名です。別の名前を選択してください。',
          });
          return;
        }

        await prisma.$transaction(async (tx) => {
          await tx.watering.updateMany({
            data: {
              plantName: event.message.text,
              status: 'WAITING_FOR_FREQUENCY_IN_DAYS',
            },
            where: {
              userId: userId,
              status: 'WAITING_FOR_PLANT_NAME',
            },
          });
        });

        await lineClient.replyMessage(event.replyToken, wateringRegistrationReply());
        return;
      }
      // 頻度待ちだったら
      if (user.waterings.some((watering) => watering.status === 'WAITING_FOR_FREQUENCY_IN_DAYS')) {
        const frequency = Number.parseInt(event.message.text.trim());
        if (Number.isNaN(frequency)) {
          await lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text: '半角数字で入力してください。 例: 90',
          });
          return;
        }

        await prisma.$transaction(async (tx) => {
          await tx.watering.updateMany({
            data: {
              frequencyInDays: frequency,
              status: 'WAITING_FOR_NEXT_DATE',
            },
            where: {
              userId: userId,
              status: 'WAITING_FOR_FREQUENCY_IN_DAYS',
            },
          });
        });

        await lineClient.replyMessage(event.replyToken, nextDateInputReply());
      }
      break;
    }
    default: {
      // NOP
      break;
    }
  }
};
