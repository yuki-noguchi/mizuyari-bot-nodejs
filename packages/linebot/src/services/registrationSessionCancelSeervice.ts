import { prisma } from '@mizuyari-bot-nodejs/common';

export const cancelRegistrationSession = async (userId: string) => {
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
};
