import { type Collection, Client } from 'discord.js';
import { log } from './lib/log';
import register from './register';

const { BOT_TOKEN } = process.env;

const client = new Client({ intents: ['Guilds'] }) as Efestus;
export interface Efestus extends Client<true> {
 commands: Collection<unknown, unknown>;
}
register(client);
client.login(BOT_TOKEN).catch(error => {
 log('e', 'Failed to login!');
 console.log(error);
});
