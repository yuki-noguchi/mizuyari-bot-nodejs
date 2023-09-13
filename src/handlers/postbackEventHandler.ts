import { PostbackEvent } from '@line/bot-sdk';
import { lineClient } from '../libs/lineClient';
import { prisma } from '../libs/prismaClient';
import { initialReply } from './replies/initialReply';
import { listWateringsReply } from './replies/listWateringsReply';
import { registrationSessionStartReply } from './replies/registrationSessionStartReply';

const parseData = (event: PostbackEvent) => {
  const datas = event.postback.data.split('&').map((pair) => pair.split('='));
  return Object.fromEntries(datas) as { [key: string]: string };
};

export const handlePostbackEvent = async (event: PostbackEvent) => {
  const data = parseData(event);
  const userId = event.source.userId;

  switch (data.action) {
    case 'registrationSessionStart': {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          data: {
            status: 'PROCESSING',
            waterings: {
              create: {
                status: 'WAITING_FOR_PLANT_NAME',
              },
            },
          },
          where: {
            id: userId,
          },
        });
      });
      await lineClient.replyMessage(event.replyToken, registrationSessionStartReply());
      break;
    }
    case 'nextDateRegistration': {
      if (!!event.postback.params && 'date' in event.postback.params) {
        const nextDate = event.postback.params.date!;
        await prisma.$transaction(async (tx) => {
          await tx.watering.updateMany({
            data: {
              nextDateTime: new Date(nextDate),
              status: 'COMPLETED',
            },
            where: {
              userId: userId,
              status: 'WAITING_FOR_NEXT_DATE',
            },
          });
        });
      }
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: '登録が完了しました。',
      });
      await lineClient.pushMessage(userId!, initialReply());
      break;
    }
    case 'cancelRegistrationSession': {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          data: {
            status: 'STAND_BY',
            waterings: {
              deleteMany: {
                status: {
                  in: ['WAITING_FOR_FREQUENCY_IN_DAYS', 'WAITING_FOR_NEXT_DATE', 'WAITING_FOR_PLANT_NAME'],
                },
              },
            },
          },
          where: {
            id: userId,
          },
        });
      });

      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: '登録をキャンセルしました。',
      });
      await lineClient.pushMessage(userId!, initialReply());
      break;
    }
    case 'listWaterings': {
      const waterings = await prisma.watering.findMany({
        select: {
          plantName: true,
          nextDateTime: true,
          frequencyInDays: true,
        },
        where: {
          userId: userId,
        },
      });

      if (waterings.length === 0) {
        await lineClient.replyMessage(
          event.replyToken,
          initialReply('まだ登録されていません。先に植物を登録をしてください。'),
        );
      }

      waterings
        .map(({ plantName, nextDateTime, frequencyInDays }) => ({
          plantName: plantName!,
          nextDateTime: nextDateTime!,
          frequencyInDays: frequencyInDays!,
        }))
        .forEach(async (watering) => {
          await lineClient.pushMessage(userId!, listWateringsReply(watering));
        });

      break;
    }
    case 'updateSessionStart': {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          data: {
            status: 'PROCESSING',
            waterings: {
              updateMany: {
                data: {
                  status: 'WAITING_FOR_PLANT_NAME',
                },
                where: {
                  plantName: data.plantName,
                  status: 'COMPLETED',
                },
              },
            },
          },
          where: {
            id: userId,
          },
        });
      });

      await lineClient.replyMessage(event.replyToken, registrationSessionStartReply());
      break;
    }
    case 'deleteWatering': {
      await prisma.$transaction(async (tx) => {
        await tx.watering.deleteMany({
          where: {
            plantName: data.plantName,
          },
        });
      });

      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: `${data.plantName}を削除しました。`,
      });

      await lineClient.pushMessage(userId!, initialReply());

      break;
    }
    default: {
      // NOP
      break;
    }
  }
};
