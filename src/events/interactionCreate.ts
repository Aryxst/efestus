import { CommandInteraction, Events } from 'discord.js';
import log from '@/lib/log';
import type { Efestus } from '..';

export const name = Events.InteractionCreate;

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const command: any = (interaction.client as Efestus).commands.get(interaction.commandName);
 if (!command) {
  log('e', `No command matching ${interaction.commandName} was found.`);
  return;
 }
 try {
  await command.execute(interaction);
 } catch (error) {
  log('e', error);
  if (interaction.replied || interaction.deferred) {
   await interaction.followUp(log.error.command.execute);
  } else {
   await interaction.reply(log.error.command.execute);
  }
 }
}
