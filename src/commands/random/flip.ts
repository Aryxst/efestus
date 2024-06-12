import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('flip')
 .setDescription('Flip a coin.');

export async function execute(interaction: CommandInteraction<any>) {
 const isEven = Math.floor((Date.now() % 2) * 1000);
 await interaction.reply(isEven ? 'heads' : 'tails');
}
