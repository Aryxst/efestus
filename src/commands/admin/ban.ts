import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('ban')
 .setDescription('Ban a user')
 .addUserOption(option => option.setName('user').setDescription('User to ban'))
 .addStringOption(option => option.setName('reason').setDescription('Reason for the ban').setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
 .setDMPermission(false);

export async function execute(interaction: CommandInteraction<any>) {
 const reason = (interaction.options.get('reason')?.value as string) || 'No reason provided.';
 const user = interaction.options.getMember('user')!;
 if (interaction.user.id == user.id) return await interaction.reply({ content: "You can't ban yourself!", ephemeral: true });

 user.send(`You have been banned from "${interaction.guild.name}" by ${interaction.user.username}! Reason:\n\n> ${reason}`).then(() => {
  interaction.guild.members.ban(user, { reason });
 });
 await interaction.reply({ content: `Successfully banned "${user.user.username}"`, ephemeral: true });
}
