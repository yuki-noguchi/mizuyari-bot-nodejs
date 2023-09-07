import { PostbackEvent } from '@line/bot-sdk';
import { client } from '../libs/client';
import { initialReply } from './replies/initialReply';
import { listWateringsReply } from './replies/listWateringsReply';
import { registrationSessionStartReply } from './replies/registrationSessionStartReply';

const parseData = (event: PostbackEvent) => {
  const datas = event.postback.data.split('&').map((pair) => pair.split('='));
  return Object.fromEntries(datas) as { [key: string]: string };
};

export const handlePostbackEvent = async (event: PostbackEvent) => {
  const data = parseData(event);
  const userId = event.source.userId;

  switch (data.action) {
    case 'registrationSessionStart': {
      // TODO 処理
      client.replyMessage(event.replyToken, registrationSessionStartReply());
      break;
    }
    case 'nextDateRegistration': {
      // TODO 処理
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: '登録が完了しました。',
      });
      client.pushMessage(userId!, initialReply());
      break;
    }
    case 'cancelRegistrationSession': {
      // TODO 処理
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: '登録をキャンセルしました。',
      });
      client.pushMessage(userId!, initialReply());
      break;
    }
    case 'listWaterings': {
      // TODO 処理
      const waterings = [
        {
          plantName: 'ばら',
          frequencyInDays: 3,
          nextDate: new Date(),
        },
        {
          plantName: 'サボテン',
          frequencyInDays: 30,
          nextDate: new Date(),
        },
      ];

      if (waterings.length === 0) {
        client.replyMessage(event.replyToken, initialReply('まだ登録されていません。先に植物を登録をしてください。'));
      }

      waterings.forEach((watering) => {
        client.pushMessage(userId!, listWateringsReply(watering));
      });

      break;
    }
    case 'updateSessionStart': {
      // TODO 処理
      client.replyMessage(event.replyToken, registrationSessionStartReply());
      break;
    }
    case 'deleteWatering': {
      // TODO 処理
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: `${data.plantName}を削除しました。`,
      });

      client.pushMessage(userId!, initialReply());

      break;
    }
    default: {
      // NOP
      break;
    }
  }
};
