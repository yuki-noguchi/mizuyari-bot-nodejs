import { PostbackEvent } from '@line/bot-sdk';
import { lineClient } from '@mizuyari-bot-nodejs/common';
import { registerNextDate } from '../services/nextDateRegistrationService';
import { cancelRegistrationSession } from '../services/registrationSessionCancelSeervice';
import { startRegistrationSession } from '../services/registrationSessionStartService';
import { startUpdateSession } from '../services/updateSessionStartService';
import { deleteWatering } from '../services/wateringDeletionService';
import { listWatergings } from '../services/wateringsListService';
import { initialReply } from './replies/initialReply';
import { listWateringsReply } from './replies/listWateringsReply';
import { registrationSessionStartReply } from './replies/registrationSessionStartReply';

export const handlePostbackEvent = async (event: PostbackEvent) => {
  const data = parseData(event);
  const userId = event.source.userId;

  switch (data.action) {
    case 'registrationSessionStart': {
      // 登録セッションを開始
      await startRegistrationSession(userId!);

      await lineClient.replyMessage(event.replyToken, registrationSessionStartReply());
      break;
    }
    case 'nextDateRegistration': {
      // 日付が存在しないことはありえないが、もし存在しない場合には何もしない
      if (!(event.postback.params && 'date' in event.postback.params)) {
        return;
      }

      // 次の水やり日を登録
      await registerNextDate(event.postback.params.date!, userId!);

      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: '登録が完了しました。',
      });
      await lineClient.pushMessage(event.source.userId!, initialReply());
      break;
    }
    case 'cancelRegistrationSession': {
      // 登録セッションをキャンセルする
      await cancelRegistrationSession(userId!);

      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: '登録をキャンセルしました。',
      });
      await lineClient.pushMessage(userId!, initialReply());
      break;
    }
    case 'listWaterings': {
      // 水やり一覧を取得する
      const waterings = await listWatergings(userId!);

      if (waterings.length === 0) {
        await lineClient.replyMessage(
          event.replyToken,
          initialReply('まだ登録されていません。', '先に植物を登録をしてください。'),
        );
      }

      waterings
        .map(({ plantName, nextDateTime, frequencyInDays }) => ({
          plantName: plantName!,
          nextDateTime: nextDateTime!,
          frequencyInDays: frequencyInDays!,
        }))
        .forEach(async (watering) => {
          await lineClient.pushMessage(userId!, listWateringsReply(watering));
        });

      break;
    }
    case 'updateSessionStart': {
      // 更新セッションを開始する
      await startUpdateSession(data.plantName, userId!);

      await lineClient.replyMessage(event.replyToken, registrationSessionStartReply());
      break;
    }
    case 'deleteWatering': {
      // 水やりを削除する
      await deleteWatering(data.plantName);

      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: `${data.plantName}を削除しました。`,
      });

      await lineClient.pushMessage(userId!, initialReply());
      break;
    }
    default: {
      // NOP
      break;
    }
  }
};

const parseData = (event: PostbackEvent) => {
  const datas = event.postback.data.split('&').map((pair) => pair.split('='));
  return Object.fromEntries(datas) as { [key: string]: string };
};
