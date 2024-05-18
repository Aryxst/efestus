import { Events } from 'discord.js';
import log from '@/lib/log';
import type { Efestus } from '..';

export const name = Events.ClientReady;
export const once = true;
export async function execute(client: Efestus) {
 log('r', `Logged in as ${client.user.tag}`);
}
