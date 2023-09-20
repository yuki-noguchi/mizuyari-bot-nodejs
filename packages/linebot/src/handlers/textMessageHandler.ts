import { MessageEvent, TextEventMessage } from '@line/bot-sdk';
import { lineClient, prisma } from '@mizuyari-bot-nodejs/common';
import { User, Watering } from '@prisma/client';
import { registerFrequencyInDays } from '../services/frequencyInDaysRegistrationService';
import { registerPlantName } from '../services/plantNameRegistrationService';
import { initialReply } from './replies/initialReply';
import { nextDateInputReply } from './replies/nextDateInputReply';
import { wateringRegistrationReply } from './replies/wateringRegistrationReply';

export const handleTextMessageEvent = async (event: Omit<MessageEvent, 'message'> & { message: TextEventMessage }) => {
  const user = await findUserById(event.source.userId);

  switch (user.status) {
    // 何も処理中でない場合には、初期メッセージを返す
    case 'STAND_BY': {
      await lineClient.replyMessage(event.replyToken, initialReply());
      break;
    }
    // 処理中の場合には、どのインプットを待っているかによって処理を分岐させる
    case 'PROCESSING': {
      // 植物名登録待ちの場合
      if (isWaitingForPlantName(user)) {
        // 重複した植物名は登録させない
        if (hasAlreadyRegisteredPlantName(user, event.message.text)) {
          await lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text: 'すでに登録されている植物名です。別の名前を選択してください。',
          });
          return;
        }

        // 植物名を登録
        await registerPlantName(event.source.userId!, event.message.text);

        await lineClient.replyMessage(event.replyToken, wateringRegistrationReply());
        return;
      }

      // 頻度待ちの場合
      if (isWaitingForFrequencyDays(user)) {
        const frequency = Number.parseInt(event.message.text.trim());

        // 数値以外は受け付けない
        if (Number.isNaN(frequency)) {
          await lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text: '半角数字で入力してください。 例: 90',
          });
          return;
        }

        // 頻度を登録
        await registerFrequencyInDays(event.source.userId!, frequency);

        await lineClient.replyMessage(event.replyToken, nextDateInputReply());
      }
      break;
    }
    default: {
      // NOP
      break;
    }
  }
};

const findUserById = async (userId: string | undefined) => {
  return prisma.user.findUniqueOrThrow({
    include: {
      waterings: true,
    },
    where: {
      id: userId,
    },
  });
};

const isWaitingForPlantName = (user: User & { waterings: Watering[] }) => {
  return user.waterings.some((watering) => watering.status === 'WAITING_FOR_PLANT_NAME');
};

const isWaitingForFrequencyDays = (user: User & { waterings: Watering[] }) => {
  return user.waterings.some((watering) => watering.status === 'WAITING_FOR_FREQUENCY_IN_DAYS');
};

const hasAlreadyRegisteredPlantName = (user: User & { waterings: Watering[] }, inputPlantName: string) => {
  return user.waterings.some((watering) => watering.plantName === inputPlantName);
};
