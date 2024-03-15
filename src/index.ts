import { Client, Collection, REST, Routes } from 'discord.js';
import { log } from '@/lib/';
import db from './database';
import register from './register';
const { TOKEN } = process.env;

const client = new Client({ intents: ['Guilds'] }) as Efestus;
export type Efestus = Client<true> & { commands: Collection<unknown, unknown> };
register(client);
client.login(TOKEN).catch(() => {
 log('e', log.error.client.login);
});
