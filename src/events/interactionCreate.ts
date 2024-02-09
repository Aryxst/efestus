import { CommandInteraction, Events } from 'discord.js';
import { log } from '@/lib/';

export const name = Events.InteractionCreate;
/** @param {import("discord.js").Interaction} interaction*/
export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const command: any = interaction.client.commands.get(interaction.commandName);
 if (!command) {
  log('e', `No command matching ${interaction.commandName} was found.`);
  return;
 }
 try {
  await command.execute(interaction);
 } catch (error) {
  log('e', error as any);
  if (interaction.replied || interaction.deferred) {
   await interaction.followUp({
    content: 'There was an error while executing this command!',
    ephemeral: true,
   });
  } else {
   await interaction.reply({
    content: 'There was an error while executing this command!',
    ephemeral: true,
   });
  }
 }
}
