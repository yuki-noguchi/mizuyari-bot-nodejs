import { prisma } from '@mizuyari-bot-nodejs/common';

export const registerNextDate = async (nextDate: string, userId: string) => {
  await prisma.$transaction(async (tx) => {
    tx.user.update({
      data: {
        status: 'STAND_BY',
        waterings: {
          updateMany: {
            data: {
              nextDateTime: new Date(nextDate),
              status: 'COMPLETED',
            },
            where: {
              userId: userId,
              status: 'WAITING_FOR_NEXT_DATE',
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });
  });
};
