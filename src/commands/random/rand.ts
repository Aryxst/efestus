import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('rand')
 .setDescription('Get a random number.')
 .addIntegerOption(option => option.setName('min').setDescription('Defaults to 0.'))
 .addIntegerOption(option => option.setName('max').setDescription('Defaults to 100.'));
export async function execute(interaction: CommandInteraction<any>) {
 const min = (interaction.options.get('min')?.value as number) || 0;
 const max = (interaction.options.get('max')?.value as number) || 100;
 await interaction.reply(String(Math.floor(Math.random() * (max - min)) + min));
}
