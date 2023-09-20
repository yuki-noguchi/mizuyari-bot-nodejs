// dotenvの制約で最初に読み込む必要がある
import { config } from 'dotenv';
config();
// --
import { lineClient, prisma } from '@mizuyari-bot-nodejs/common';
import { addDays, endOfToday, format, startOfToday } from 'date-fns';

/**
 * 今日が水やり日の一覧を取得し、テキストメッセージを送信する
 */
const main = async () =>
  await prisma.$transaction(async (tx) => {
    const waterings = await tx.watering.findMany({
      include: {
        user: true,
      },
      where: {
        nextDateTime: {
          gte: startOfToday(),
          lte: endOfToday(),
        },
        frequencyInDays: {
          not: null,
        },
      },
    });

    await Promise.all(
      waterings.map(async (watering) => {
        const nextDateTime = addDays(startOfToday(), watering.frequencyInDays!);

        await tx.watering.update({
          data: {
            nextDateTime: nextDateTime,
          },
          where: {
            id: watering.id,
          },
        });

        return await lineClient.pushMessage(watering.userId, {
          type: 'text',
          text: `${watering.plantName}の水やり日です。次は${format(nextDateTime, 'yyyy年MM月dd日')}です。`,
        });
      }),
    );
  });

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
