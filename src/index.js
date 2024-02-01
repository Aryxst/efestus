import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
const { TOKEN } = process.env;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = join(import.meta.dir, 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
 const commandsPath = join(foldersPath, folder);
 const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
 for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
   client.commands.set(command.data.name, command);
  } else {
   console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
 }
}

const eventsPath = join(import.meta.dir, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
 const filePath = join(eventsPath, file);
 const event = require(filePath);
 if (event.once) {
  client.once(event.name, (...args) => event.execute(...args));
 } else {
  client.on(event.name, (...args) => event.execute(...args));
 }
}

client.login(TOKEN);
