import { prisma } from '@mizuyari-bot-nodejs/common';

export const deleteWatering = async (plantName: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.watering.deleteMany({
      where: {
        plantName: plantName,
      },
    });
  });
};
