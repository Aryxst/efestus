import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import config from '@/config';

export const data = new SlashCommandBuilder().setName('dog').setDescription('Find a cute dog picture!');

type Result = { url: string };

export async function execute(interaction: CommandInteraction<any>) {
 await interaction.deferReply();
 await interaction.editReply('Finding a cute doggo...');

 const headers = new Headers({
  'Content-Type': 'application/json',
 });

 fetch(config.apis.dog, {
  method: 'GET',
  headers: headers,
  redirect: 'follow',
 })
  .then(response => response.json())
  .then(async result => {
   await interaction.editReply({
    content: null,
    embeds: [new EmbedBuilder().setTitle('Woof!🐶').setImage((result as Result).url)],
   });
  })
  .catch(async () => {
   await interaction.editReply('An error occured!');
  });
}
