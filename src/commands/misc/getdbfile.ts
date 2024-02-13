import { get_file, default as db } from '@/database';
import { log } from '@/lib';
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('getdbfile')
 .setDescription('Get a file from the database')
 .addIntegerOption(option => option.setName('id').setDescription('The id of the file.').setRequired(true));
export async function execute(interaction: CommandInteraction<any>) {
 const id = interaction.options.get('id')?.value as number;
 const file = get_file(id);
 if (!file) return log('e', log.info.table.not_exist, id, 'files');
 if (file.attachment_url) {
  log('d', 'Sent file with attachment_url');
  return await interaction.reply({
   content: `${file.attachment_url} , uploaded on ${file.upload_date}`,
  });
 }
 const reply = await interaction.reply({
  content: `${file.name}, uploaded on ${file.upload_date}`,
  files: [new AttachmentBuilder(Buffer.from(file.buffer, 'utf-8'), { name: file.name })],
  fetchReply: true,
 });

 if (!file.attachment_url) {
  db.exec(`
UPDATE files 
SET attachment_url = "${Array.from(reply.attachments.entries())[0][1].url}"
WHERE rowid = ${id}`);
  log('d', log.info.table.update_entry, 'attachment_url', 'files', id);
 }
}
