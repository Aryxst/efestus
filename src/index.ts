import { Client, type Collection } from 'discord.js';
import log from './lib/log';
import register from './register';

const { TOKEN } = process.env;

const client = new Client({ intents: ['Guilds'] }) as Efestus;
export interface Efestus extends Client<true> {
 commands: Collection<unknown, unknown>;
}
register(client);
client.login(TOKEN).catch(() => {
 log('e', 'Failed to login!');
});
