import { FlexText, Message } from '@line/bot-sdk';

export const initialReply: (...additionalMessages: string[]) => Message = (...additionalMessages) => ({
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
        ...additionalMessages.map<FlexText>((message) => ({
          type: 'text',
          text: message,
          margin: 'md',
        })),
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
            label: '植物を登録する',
            data: 'action=registrationSessionStart',
            inputOption: 'openKeyboard',
          },
        },
        {
          type: 'button',
          style: 'link',
          height: 'sm',
          action: {
            type: 'postback',
            label: '登録した植物一覧を確認する',
            data: 'action=listWaterings',
          },
        },
      ],
      flex: 0,
    },
  },
});
