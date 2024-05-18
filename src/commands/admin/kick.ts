import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('kick')
 .setDescription('Kick a user')
 .addUserOption(option => option.setName('user').setDescription('User to kick'))
 .addStringOption(option => option.setName('reason').setDescription('Reason for the kick').setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
 .setDMPermission(false);

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const reason = interaction.options.getString('reason')!;
 const user = interaction.options.getUser('user')!;
 if (interaction.user.id == user.id) {
  await interaction.reply({ content: "You can't kick yourself!", ephemeral: true });
  return;
 }
 user.send(`You have been kicked from "${interaction.guild.name}" by ${interaction.user.username}! Reason:\n\n> ${reason}`).then(() => {
  interaction.guild.members.kick(user, reason);
 });

 await interaction.reply({ content: `Successfully kicked "${user.username}"`, ephemeral: true });
}
