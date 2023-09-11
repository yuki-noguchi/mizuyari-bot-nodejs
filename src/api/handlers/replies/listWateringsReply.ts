import { Message } from '@line/bot-sdk';
import { format } from 'date-fns';

export const listWateringsReply: (watering: {
  plantName: string;
  frequencyInDays: number;
  nextDateTime: Date;
}) => Message = ({ plantName, nextDateTime, frequencyInDays }) => ({
  type: 'flex',
  altText: '水やりリマインダー',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: plantName,
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'text',
          text: `・${frequencyInDays}日ごとに水やり`,
          margin: 'md',
        },
        {
          type: 'text',
          text: `・次は${format(nextDateTime, 'yyyy年MM月dd日')}`,
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          height: 'sm',
          action: {
            type: 'postback',
            label: '登録情報を編集する',
            data: `action=updateSessionStart&plantName=${plantName}`,
            inputOption: 'openKeyboard',
          },
        },
        {
          type: 'button',
          style: 'link',
          height: 'sm',
          action: {
            type: 'postback',
            label: '削除する',
            data: `action=deleteWatering&plantName=${plantName}`,
          },
        },
      ],
      flex: 0,
    },
  },
});
