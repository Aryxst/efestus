import {
 CommandInteraction,
 InteractionContextType,
 PermissionFlagsBits,
 SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('ban')
 .setDescription('Ban a user')
 .addUserOption(option => option.setName('user').setDescription('User to ban'))
 .addStringOption(option =>
  option
   .setName('reason')
   .setDescription('Reason for the ban')
   .setRequired(false),
 )
 .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
 .setContexts([InteractionContextType.Guild]);

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const reason = interaction.options.getString('reason')!;
 const user = interaction.options.getUser('user')!;
 if (interaction.user.id == user.id)
  return await interaction.reply({
   content: "You can't ban yourself!",
   ephemeral: true,
  });

 user
  .send(
   `You have been banned from "${interaction.guild.name}" by ${interaction.user.username}! Reason:\n\n> ${reason}`,
  )
  .then(() => {
   interaction.guild.members.ban(user, { reason });
  });
 await interaction.reply({
  content: `Successfully banned "${user.username}"`,
  ephemeral: true,
 });
}
