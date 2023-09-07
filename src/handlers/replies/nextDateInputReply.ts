import { Message } from '@line/bot-sdk';
import { addYears, format } from 'date-fns';

export const nextDateInputReply: () => Message = () => ({
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
          text: '次の水やり日を選択してください。',
          margin: 'md',
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
            type: 'datetimepicker',
            label: '日付を選択する',
            mode: 'date',
            data: 'action=nextDateRegistration',
            initial: format(new Date(), 'yyyy-MM-dd'),
            min: format(new Date(), 'yyyy-MM-dd'),
            max: format(addYears(new Date(), 10), 'yyyy-MM-dd'),
          },
        },
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
