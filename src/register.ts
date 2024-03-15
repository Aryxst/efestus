import { Collection, REST, Routes } from 'discord.js';
import config from './config';
import { log } from './lib';
import type { Efestus } from '.';
const { TOKEN, GUILD_ID, CLIENT_ID } = process.env;
const glob = new Bun.Glob('*');

// This function psots all commands to REST, and loads events before starting the bot
export default (client: Efestus) => {
 client.commands = new Collection();
 for (const folder of glob.scanSync({ cwd: './src/commands/', onlyFiles: false })) {
  for (const file of glob.scanSync({ cwd: './src/commands/' + folder, absolute: true })) {
   const command = require(file);
   if ('data' in command && 'execute' in command) {
    config.disabled.indexOf(command.data.name) == -1 && client.commands.set(command.data.name, command);
   } else {
    log('w', `The command at ${file} is missing a required "data" or "execute" property.`);
   }
  }
 }
 const rest = new REST().setToken(TOKEN as string);
 (async () => {
  try {
   log('i', `Started refreshing ${client.commands.size} application (/) commands.`);
   const data = (await rest.put(Routes.applicationGuildCommands(CLIENT_ID as string, GUILD_ID as string), { body: client.commands.map((c: any) => c.data.toJSON()) })) as ArrayLike<any>;
   log('r', `Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
   log('e', error);
  }
 })();
 for (const file of glob.scanSync({ cwd: './src/events/', absolute: true })) {
  const event = require(file);
  if (event.once) {
   client.once(event.name, (...args) => event.execute(...args));
  } else {
   client.on(event.name, (...args) => event.execute(...args));
  }
 }
};
