import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('purge')
 .setDescription('Delete an amount of messages.')
 .addIntegerOption(option => option.setName('count').setDescription('The amount of messages to delete.').setMaxValue(100).setRequired(true));
export async function execute(interaction: CommandInteraction<any>) {
 const res = await interaction.channel?.bulkDelete(interaction.options.get('count')?.value as number);
 await interaction.reply(`Successfully deleted ${res?.size} messages!`).then(async msg => {
  await Bun.sleep(2000);
  msg.delete();
 });
}
