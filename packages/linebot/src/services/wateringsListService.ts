import { prisma } from '@mizuyari-bot-nodejs/common';

export const listWatergings = async (userId: string) => {
  return await prisma.watering.findMany({
    select: {
      plantName: true,
      nextDateTime: true,
      frequencyInDays: true,
    },
    where: {
      userId: userId,
    },
  });
};
