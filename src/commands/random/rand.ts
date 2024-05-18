import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('rand')
 .setDescription('Get a random number.')
 .addIntegerOption(option => option.setName('min').setDescription('Defaults to 0.'))
 .addIntegerOption(option => option.setName('max').setDescription('Defaults to 100.'));
export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const min = interaction.options.getInteger('min') || 0;
 const max = interaction.options.getInteger('max') || 100;

 await interaction.reply(String(Math.floor(Math.random() * (max - min)) + min));
}
