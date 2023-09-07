import { MessageEvent, TextEventMessage } from '@line/bot-sdk';
import { client } from '../libs/client';
import { initialReply } from './replies/initialReply';
import { nextDateInputReply } from './replies/nextDateInputReply';
import { wateringRegistrationReply } from './replies/wateringRegistrationReply';

const isWaigingForPlantName = () => {
  return false;
};

const isWaigingForFrequencyDays = () => {
  return true;
};

export const handleTextMessageEvent = (event: Omit<MessageEvent, 'message'> & { message: TextEventMessage }) => {
  const userId = event.source.userId;

  // TODO 処理
  const user: {
    userId: string;
    status: 'STAND_BY' | 'PROCESSING';
  } = {
    userId: userId!,
    status: 'PROCESSING',
  };

  switch (user.status) {
    case 'STAND_BY': {
      client.replyMessage(event.replyToken, initialReply());
      break;
    }
    case 'PROCESSING': {
      // TODO 処理
      // 植物名登録待ちだったら
      if (isWaigingForPlantName()) {
        client.replyMessage(event.replyToken, wateringRegistrationReply());
        return;
      }
      // 頻度待ちだったら
      if (isWaigingForFrequencyDays()) {
        const frequency = Number.parseInt(event.message.text.trim());
        if (Number.isNaN(frequency)) {
          client.replyMessage(event.replyToken, {
            type: 'text',
            text: '半角数字で入力してください。 例: 90',
          });
          return;
        }

        client.replyMessage(event.replyToken, nextDateInputReply());
      }
      break;
    }
    default: {
      // NOP
      break;
    }
  }
};
