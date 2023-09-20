import { prisma } from '@mizuyari-bot-nodejs/common';

export const startUpdateSession = async (plantName: string, userId: string) => {
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
              plantName: plantName,
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
};
