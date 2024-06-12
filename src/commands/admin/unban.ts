import {
 CommandInteraction,
 InteractionContextType,
 PermissionFlagsBits,
 SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('unban')
 .setDescription('Unban a user')
 .addUserOption(option =>
  option.setName('user').setDescription('User ID to unban'),
 )
 .addStringOption(option =>
  option
   .setName('reason')
   .setDescription('Reason for the unban')
   .setRequired(false),
 )
 .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
 .setContexts([InteractionContextType.Guild]);

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const reason = interaction.options.getString('reason')!;
 const user = interaction.options.getUser('user');

 await interaction.guild.bans.fetch().then(async bans => {
  if (bans.size == 0)
   return await interaction.reply({
    content: 'There are no banned users.',
    ephemeral: true,
   });
  const bannedId = bans.find(ban => ban.user.id == user!.id);
  if (!bannedId)
   return interaction.reply({ content: "The given ID isn't banned!" });
  await interaction.guild.bans.remove(user!.id, reason).catch(err => {
   return interaction.reply({ content: "I can't unban this user." });
  });
 });
}
