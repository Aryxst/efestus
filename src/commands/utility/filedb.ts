import { get_all, get_file, get_table_count, upload_file } from '@/database';
import { log } from '@/lib';
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
 .setName('db')
 .setDescription('Interact with the public database.')
 .addSubcommand(cmd =>
  cmd
   .setName('get')
   .setDescription('Get a file from the database.')
   .addIntegerOption(option => option.setName('id').setDescription('The id of the file.').setRequired(true))
 )
 .addSubcommand(cmd =>
  cmd
   .setName('list')
   .setDescription('List files in a given range.')
   .addIntegerOption(option => option.setName('start').setDescription('Defaults to 0.'))
   .addIntegerOption(option => option.setName('end').setDescription('Defaults to 10.'))
 )
 .addSubcommandGroup(group =>
  group
   .setName('save')
   .setDescription('Upload a file to the database.')
   .addSubcommand(cmd =>
    cmd
     .setName('fromdisk')
     .setDescription('Source the file from disk.')
     .addAttachmentOption(option => option.setName('file').setDescription('The file from your disk to upload.').setRequired(true))
   )
   .addSubcommand(cmd =>
    cmd
     .setName('fromurl')
     .setDescription('Source the file from a url.')
     .addStringOption(option => option.setName('url').setDescription('The url of the file to upload.').setRequired(true))
     .addStringOption(option => option.setName('name').setDescription('The name of the file, with extension.').setRequired(true))
   )
 );
export async function execute(interaction: CommandInteraction<any>) {
 const cmd = interaction.options.data[0];
 await interaction.deferReply({ ephemeral: false });
 switch (cmd.name) {
  case 'get': {
   const id = cmd.options?.[0].value;
   const file = get_file(id as number);
   if (!file) {
    await interaction.editReply(`File with id "${id}" does not exist!"`);
   }
   if (file && file.attachment_url) {
    log('d', 'Sent file with attachment_url');
    await interaction.editReply(`${file.attachment_url} , uploaded on ${file.upload_date}`);
   }
   break;
  }
  case 'list': {
   const res = get_all('files');
   const rows = res.length;
   const start = (cmd.options?.[0] ? cmd.options?.[0].value : 1) as number;
   const end = (cmd.options?.[1] ? cmd.options?.[1].value : rows < 10 ? res.length : 1) as number;

   if (start <= rows && rows >= end) {
    await interaction.editReply(
     res
      .slice(start - 1, end)
      .map(file => `${file.id}) ${file.attachment_url} - Uploaded on ${file.upload_date}`)
      .join('\n')
    );
   } else {
    await interaction.editReply('Cannot access non existent files. Either there are no available files or you need to provide a valid range.');
   }
   break;
  }
  case 'save': {
   const sub_option = cmd.options?.[0]?.options?.[0];
   if (cmd.options?.[0]?.name == 'fromdisk') {
    const res = await fetch(sub_option?.attachment?.url as string);
    if (res.status < 400) {
     upload_file(sub_option?.attachment?.name as string, sub_option?.attachment?.url);
     await interaction.editReply(`Successfully uploaded file! With id ${get_table_count('files').rows}`);
    } else {
     await interaction.editReply(log.error.command.upload_fetch);
    }
   } else {
    const url = sub_option?.value as string;
    const file_name = cmd?.options?.[1]?.value as string;
    const res = await fetch(url);
    if (res.status < 400) {
     const buffer = Buffer.from(await res.arrayBuffer());
     const message = await interaction.editReply({ content: "Successfully uploaded file! Here' the result:", files: [new AttachmentBuilder(buffer)] });
     upload_file(file_name, Array.from(message.attachments.entries())[0][1].url);
    } else {
     await interaction.editReply(log.error.command.upload_fetch);
    }
   }
   break;
  }
 }
 log('i', JSON.stringify(interaction.options.data, null, 2));
}

//
