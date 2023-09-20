import { prisma } from '@mizuyari-bot-nodejs/common';

export const registerPlantName = async (userId: string, plantName: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.watering.updateMany({
      data: {
        plantName: plantName,
        status: 'WAITING_FOR_FREQUENCY_IN_DAYS',
      },
      where: {
        userId: userId,
        status: 'WAITING_FOR_PLANT_NAME',
      },
    });
  });
};
