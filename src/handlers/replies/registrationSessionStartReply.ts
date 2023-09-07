import { Message } from '@line/bot-sdk';

export const registrationSessionStartReply: () => Message = () => ({
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
          text: '水やりリマインダー',
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'text',
          text: '植物の名前を入力してください。',
          margin: 'md',
        },
        {
          type: 'text',
          text: ' 例: サボテン',
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
