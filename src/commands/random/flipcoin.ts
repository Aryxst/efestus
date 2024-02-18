import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('flip').setDescription('Flip a coin.');
export async function execute(interaction: CommandInteraction<any>) {
 const is_even = Date.now() % 2;
 await interaction.reply(is_even ? 'heads' : 'tails');
}
