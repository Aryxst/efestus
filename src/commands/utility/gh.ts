import { isImage } from '@/lib/is-image';
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('gh')
 .setDescription('Interact with github content.')
 .addSubcommand(cmd =>
  cmd
   .setName('get')
   .setDescription('Get a file content/preview from github.')
   .addStringOption(option => option.setName('url').setDescription('The file path to get.').setRequired(true)),
 );
export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const baseUrl = interaction.options.getString('url', true);

 if (!new URL(baseUrl) || !baseUrl.includes('github')) {
  await interaction.reply({ content: 'Invalid URL', ephemeral: true });
  return;
 }

 const rawUrl = baseUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');

 const [fileName, lineArgs] = rawUrl.split('/').pop()?.split('#') || ([rawUrl.split('/').pop(), undefined] as [string?, string?]);

 if (isImage(fileName!)) {
  await interaction.reply({ files: [new AttachmentBuilder(rawUrl)] });
  return;
 }
 const [start, end] = (lineArgs?.replace(/L/g, '')?.split('-') || [undefined, undefined]) as [string?, string?];

 console.log({ fileName, lineArgs, start, end });

 const res = await fetch(rawUrl);
 if (res.status < 400) {
  const responseText = await res.text();
  const text = lineArgs?.length
   ? responseText
      .split('\n')
      .slice(+start! - 1, +end! || +start!)
      .join('\n')
   : responseText;
  const attachment = new AttachmentBuilder(Buffer.from(text), { name: fileName });
  await interaction.reply({
   files: [attachment],
  });
 } else {
  await interaction.reply('Error while fetching resource, is the url correct?');
 }
}
