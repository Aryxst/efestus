import { get_table_count, upload_file } from '@/database';
import { log } from '@/lib';
import { SlashCommandBuilder, CommandInteraction, AttachmentBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('uploadfile')
 .setDescription('Upload a file to the database.')
 .addSubcommand(cmd =>
  cmd
   .setName('fromdisk')
   .setDescription('Where to source the file from.')
   .addAttachmentOption(option => option.setName('file').setDescription('The file from your disk to upload.'))
 )
 .addSubcommand(cmd =>
  cmd
   .setName('fromurl')
   .setDescription('Where to source the file from.')
   .addStringOption(option => option.setName('url').setDescription('The url of the file to upload.').setRequired(true))
   .addStringOption(option => option.setName('name').setDescription('The name of the file, with the extension.').setRequired(true))
 );
export async function execute(interaction: CommandInteraction<any>) {
 const sub = interaction.options?.data?.[0]?.options;
 if (!sub) return log('e', "Didn't provide enough fields!");
 await interaction.deferReply();
 if (sub?.[0].name == 'file') {
  const option = sub[0];
  const res = await fetch(option.attachment?.url as string);
  if (res.status < 400) {
   upload_file(option.attachment?.name as string, option.attachment?.url);
   await interaction.editReply({ content: `Successfully uploaded file! You can access it with /getfile id` });
   log('d', 'Request successfull!', get_table_count('files'));
  } else {
   await interaction.editReply(log.error.command.uploadfetch);
  }
 } else {
  const res = await fetch(sub?.[0].value as string);
  if (res.status < 400) {
   const blob = Buffer.from(await res.arrayBuffer());
   const message = await interaction.reply({ content: "Successfully uploaded file! Here' the result:", files: [new AttachmentBuilder(blob)], fetchReply: true });
   upload_file(sub?.[1].value as string, Array.from(message.attachments.entries())[0][1].url);
   log('d', 'Request successfull!\n', JSON.stringify(sub?.[0], null, 2));
  } else {
   await interaction.editReply(log.error.command.uploadfetch);
  }
 }
 log('d', typeof sub, JSON.stringify(sub, null, 2));
}
