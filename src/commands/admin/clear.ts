import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('clear')
 .setDescription('Delete an amount of messages.')
 .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
 .addIntegerOption(option => option.setName('count').setDescription('The amount of messages to delete.').setMaxValue(100).setRequired(true));
export async function execute(interaction: CommandInteraction<any>) {
 const res = await interaction.channel?.bulkDelete(interaction.options.get('count')?.value as number);

 await interaction.reply({ content: `Successfully deleted ${res?.size} messages!`, ephemeral: true }).then(async msg => {
  await Bun.sleep(2000);
  msg.delete();
 });
}
