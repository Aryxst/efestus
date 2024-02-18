import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('pfp')
 .setDescription('Provides a user profile picture!')
 .addUserOption(option => option.setName('user').setDescription("The user's you want the pfp of.").setRequired(false));
export async function execute(interaction: CommandInteraction<any>) {
 await interaction.reply((interaction.options.getUser('user') ?? interaction.user).avatarURL() as string);
}
