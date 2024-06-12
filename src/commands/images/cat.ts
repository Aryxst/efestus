import config from '@/config';
import {
 CommandInteraction,
 EmbedBuilder,
 SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('cat')
 .setDescription('Find a cute cat picture!');

type Result = Array<{ url: string }>;

export async function execute(interaction: CommandInteraction<any>) {
 await interaction.deferReply();
 await interaction.editReply('Finding a cute cat...');

 const headers = new Headers({
  'Content-Type': 'application/json',
  'x-api-key': process.env.CAT_APIKEY!,
 });

 fetch(config.apis.cat, {
  method: 'GET',
  headers: headers,
  redirect: 'follow',
 })
  .then(response => response.json())
  .then(async result => {
   await interaction.editReply({
    content: null,
    embeds: [
     new EmbedBuilder().setTitle('Meow!😺').setImage((result as Result)[0].url),
    ],
   });
  })
  .catch(async () => {
   await interaction.editReply('An error occured!');
  });
}
