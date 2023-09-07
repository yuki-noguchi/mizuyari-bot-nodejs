import { Message } from '@line/bot-sdk';

export const wateringRegistrationReply: () => Message = () => ({
  type: 'flex',
  altText: 'ALT',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '水やりリマインダー',
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'text',
          text: '水やりを何日ごとにやるか、',
          margin: 'md',
        },
        {
          type: 'text',
          text: '半角数字で入力してください。 ',
        },
        {
          type: 'text',
          text: '例: 90',
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
          style: 'link',
          height: 'sm',
          action: {
            type: 'postback',
            label: '登録をキャンセルする',
            data: 'action=cancelRegistrationSession',
          },
        },
      ],
      flex: 0,
    },
  },
});
