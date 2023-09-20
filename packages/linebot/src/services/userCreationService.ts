import { prisma } from '@mizuyari-bot-nodejs/common';

export const createUser = async (userId: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      create: {
        id: userId,
        status: 'STAND_BY',
      },
      update: {
        status: 'STAND_BY',
      },
      where: {
        id: userId,
      },
    });
  });
};
