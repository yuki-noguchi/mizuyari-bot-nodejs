import { prisma } from '@mizuyari-bot-nodejs/common';

export const registerFrequencyInDays = async (userId: string, frequency: number) => {
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
};
