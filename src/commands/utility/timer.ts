import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { scheduleJob } from 'node-schedule';

export const data = new SlashCommandBuilder().setName('timer').setDescription('Starts a timer.');
export async function execute(interaction: CommandInteraction<any>) {
 /* scheduleJob(`* * `) */
}
