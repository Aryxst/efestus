import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Glob } from 'bun';
import log from './lib/log';
const { TOKEN } = process.env;

const glob = new Glob('*');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
export type Efestus = Client<true>;

client.commands = new Collection();

for (const folder of glob.scanSync({ cwd: './src/commands/', onlyFiles: false })) {
 for (const file of glob.scanSync({ cwd: './src/commands/' + folder, absolute: true })) {
  const command = require(file);
  if ('data' in command && 'execute' in command) {
   client.commands.set(command.data.name, command);
  } else {
   log('w', `The command at ${file} is missing a required "data" or "execute" property.`);
  }
 }
}

for (const file of glob.scanSync({ cwd: './src/events/', absolute: true })) {
 const event = require(file);
 if (event.once) {
  client.once(event.name, (...args) => event.execute(...args));
 } else {
  client.on(event.name, (...args) => event.execute(...args));
 }
}

client.login(TOKEN).catch(() => {
 log('e', log.error.login);
});
