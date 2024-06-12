import {
 CommandInteraction,
 PermissionFlagsBits,
 SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('say')
 .setDescription('Make the bot say something.')
 .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
 .addStringOption(option =>
  option
   .setName('text')
   .setDescription('The content of the message.')
   .setRequired(true),
 );

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const text = interaction.options.getString('text')!;

 await interaction.channel?.send(text);
 await interaction
  .reply({
   content: `Message sent to <#${interaction.channelId}>`,
   ephemeral: true,
  })
  .then(async v => await v.delete());
}
