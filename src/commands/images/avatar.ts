import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('avatar')
 .setDescription("View a user's avatar.")
 .addUserOption(option =>
  option
   .setName('user')
   .setDescription('Specify the user you want to get the avatar from.')
   .setRequired(false),
 );

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 await interaction.reply(
  (interaction.options.getUser('user') ?? interaction.user).avatarURL()!,
 );
}
