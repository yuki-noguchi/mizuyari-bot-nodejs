import { Client } from '@line/bot-sdk';
import { lineConfig } from '../config/config';

const lineClient = new Client(lineConfig);

export { lineClient };
