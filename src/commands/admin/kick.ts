import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('kick')
 .setDescription('Kick a user')
 .addUserOption(option => option.setName('user').setDescription('User to kick'))
 .addStringOption(option => option.setName('reason').setDescription('Reason for the kick').setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
 .setDMPermission(false);

export async function execute(interaction: CommandInteraction<any>) {
 const reason = (interaction.options.get('reason')?.value as string) || 'No reason provided.';
 const user = interaction.options.getMember('user')!;
 if (interaction.user.id == user.id) return await interaction.reply({ content: "You can't kick yourself!", ephemeral: true });

 user.send(`You have been kicked from "${interaction.guild.name}" by ${interaction.user.username}! Reason:\n\n> ${reason}`).then(() => {
  interaction.guild.members.kick(user, reason);
 });
 await interaction.reply({ content: `Successfully kicked "${user.user.username}"`, ephemeral: true });
}
