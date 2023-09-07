import { Client } from '@line/bot-sdk';
import { lineConfig } from '../config/config';

export const client = new Client(lineConfig);
