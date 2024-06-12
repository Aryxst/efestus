import {
 CommandInteraction,
 EmbedBuilder,
 PermissionFlagsBits,
 SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('clear')
 .setDescription('Delete an amount of messages.')
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
 .addIntegerOption(option =>
  option
   .setName('count')
   .setDescription('The amount of messages to delete.')
   .setMaxValue(100)
   .setRequired(true),
 );

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const count = interaction.options.getInteger('count', true);
 const res = await interaction.channel?.bulkDelete(count, true);

 if (res?.size == 0) {
  await interaction.reply({
   embeds: [new EmbedBuilder().setDescription('No messages to delete.')],
   ephemeral: true,
  });
  return;
 }
 await interaction.reply({
  embeds: [
   new EmbedBuilder().setDescription(
    `Successfully deleted ${res?.size} messages!`,
   ),
  ],
  ephemeral: true,
 });
}
