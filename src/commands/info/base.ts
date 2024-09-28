import type { CommandInteraction } from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import isDocker from 'is-docker';

export const data = new SlashCommandBuilder()
 .setName('info')
 .setDescription('Provides general information related to the guild.')
 .addSubcommand(cmd =>
  cmd.setName('bot').setDescription('Get my runtime info.'),
 )
 .addSubcommand(cmd =>
  cmd
   .setName('server')
   .setDescription('Provides information about the server.'),
 );

const parsedBotMetadata = [
 `Bot runtime: Bun ${process.versions.bun}`,
 `Bot version: ${require('../../../package.json').version}`,
 `Environment: ${process.env.NODE_ENV || 'development'}`,
 `Shell: ${process.env.SHELL?.split('/').pop() || (isDocker() && 'Docker') || 'unknown'}`,
 `Platform: ${process.platform}`,
].join('\n');

export async function execute(interaction: CommandInteraction) {
 if (!interaction.isChatInputCommand()) return;

 switch (interaction.options.getSubcommand()) {
  case 'bot':
   await interaction.reply({
    embeds: [
     new EmbedBuilder()
      .setTitle('BOT INFO')
      .setDescription(parsedBotMetadata)
      .setColor(0x3498db),
    ],
   });
   break;
  case 'server':
   await interaction.reply({
    embeds: [
     new EmbedBuilder()
      .setTitle('Server Info')
      .setDescription(
       `This server is called "${interaction?.guild?.name}" and currently has ${interaction?.guild?.memberCount} members.`,
      )
      .setTimestamp(Date.now()),
    ],
   });
   break;
 }
}
