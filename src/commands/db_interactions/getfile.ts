import { get_file } from '@/database';
import { log } from '@/lib';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('getfile')
 .setDescription('Get a file from the database')
 .addIntegerOption(option => option.setName('id').setDescription('The id of the file.').setRequired(true));
export async function execute(interaction: CommandInteraction<any>) {
 const id = interaction.options.get('id')?.value;
 const file = get_file(id as number);
 log('d', JSON.stringify(file, null, 2));
 if (!file) return log('e', log.info.table.not_exist, id, 'files');
 if (file.attachment_url) {
  log('d', 'Sent file with attachment_url');
  return await interaction.reply({
   content: `${file.attachment_url} , uploaded on ${file.upload_date}`,
  });
 } else {
  log('e', 'attachment_url not found');
 }
}
