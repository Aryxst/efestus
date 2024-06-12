import { log } from '@/lib/log';
import { type GuildTextBasedChannel, Events } from 'discord.js';
import type { Efestus } from '..';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: Efestus) {
 log('r', `Logged in as ${client.user.tag}`);
 const generalChat = client.channels.cache.get(
  '1168196452443492393',
 ) as GuildTextBasedChannel;
}
