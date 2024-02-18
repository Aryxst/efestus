import { SlashCommandBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder().setName('botinfo').setDescription('Get my runtime info.');

export async function execute(interaction: CommandInteraction) {
 await interaction.reply(
  `
>>> Bot runtime: Bun ${process.versions.bun}
Environment: ${import.meta.env.NODE_ENV}
Shell: ${import.meta.env.SHELL?.split('/').pop()}
Platform: ${process.platform}
    `
 );
}
