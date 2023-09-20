import { prisma } from '@mizuyari-bot-nodejs/common';

export const startRegistrationSession = async (userId: string) => {
  // ユーザーを処理中にし、水やりを新規に作成する
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
};
