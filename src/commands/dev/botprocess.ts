import { SlashCommandBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder().setName('botprocess').setDescription('Get my runtime info.');

export async function execute(interaction: CommandInteraction) {
 await interaction.reply(
  `
>>> Bot runtime: Bun ${Bun.version}
Environment: ${import.meta.env.NODE_ENV}
RAM Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toPrecision(2)} MB
Shell: ${import.meta.env.SHELL?.split('/').pop()}
Platform: ${process.platform}
    `
 );
}
