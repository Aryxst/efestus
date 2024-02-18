import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('pfp')
 .setDescription("View a user' avatar.")
 .addUserOption(option => option.setName('user').setDescription('Specify the user you want to get the avatar from.').setRequired(false));
export async function execute(interaction: CommandInteraction<any>) {
 await interaction.reply((interaction.options.getUser('user') ?? interaction.user).avatarURL() as string);
}
