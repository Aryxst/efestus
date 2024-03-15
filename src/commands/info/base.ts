import { SlashCommandBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';

// This command provides basic general information
export const data = new SlashCommandBuilder()
 .setName('info')
 .setDescription('Provides general information related to the guild.')
 .addSubcommand(cmd => cmd.setName('bot').setDescription('Get my runtime info.'))
 .addSubcommand(cmd => cmd.setName('server').setDescription('Provides information about the server.'));
export async function execute(interaction: CommandInteraction) {
 const cmd_name = interaction.options.data[0].name;
 switch (cmd_name) {
  // This subcommand provides information about the bot
  case 'bot':
   {
    await interaction.reply(
     `
>>> Bot runtime: Bun ${process.versions.bun}
Environment: ${import.meta.env.NODE_ENV}
Shell: ${import.meta.env.SHELL?.split('/').pop()}
Platform: ${process.platform}
`
    );
   }
   break;
  // This subcommand provides information about the bot
  case 'server': {
   await interaction.reply(`This server is called "${interaction?.guild?.name}" and has ${interaction?.guild?.memberCount} members.`);
  }
 }
}
