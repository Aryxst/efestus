import { log } from '@/lib/log';
import { CommandInteraction, Events } from 'discord.js';
import type { Efestus } from '..';

export const name = Events.InteractionCreate;

export async function execute(interaction: CommandInteraction<any>) {
 const command: any = (interaction.client as Efestus).commands.get(interaction.commandName);
 if (!command) {
  log('e', `No command matching ${interaction.commandName} was found.`);
  return;
 }

 if (interaction.isChatInputCommand()) {
  try {
   await command.execute(interaction);
  } catch (error) {
   log('e', error);

   if (interaction.replied || interaction.deferred) {
    await interaction.followUp('Something went wrong!');
   } else {
    await interaction.reply('Something went wrong!');
   }
  }
 } else if (interaction.isAutocomplete()) {
  try {
   await command.autocomplete(interaction);
  } catch (error) {
   log('e', error);
  }
 }
}
