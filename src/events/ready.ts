import { Events } from 'discord.js';
import { log } from '@/lib/';
import type { Efestus } from '..';

export const name = Events.ClientReady;
export const once = true;
export function execute(client: Efestus) {
 log('r', `Logged in as ${client.user.tag}`);
}
