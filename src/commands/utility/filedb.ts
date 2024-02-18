import db from '@/database';
import * as Q from '@/interfaces/models';
import { log } from '@/lib';

import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';
const upload_file = (name: string, attachment_url: string = '') =>
 db.exec(
  `
  INSERT INTO files (name, upload_date, attachment_url) 
  VALUES (?, ?, ?);
  `,
  [name, new Date().toLocaleDateString(), attachment_url]
 );
const get_file_query = db.query('SELECT * FROM files WHERE rowid = ?');
const get_file = (rowid: number) => get_file_query.get(rowid) as Q.File;
const all_files = db.query(`SELECT *, rowid as id FROM files`);
const all_files_count_query = db.query('SELECT COUNT(*) AS rows FROM files');
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

 switch (cmd.name) {
  case 'get': {
   const id = cmd.options?.[0].value;
   const file = get_file(id as number);

   if (!file) {
    await interaction.reply(`File with id "${id}" does not exist!"`);
   }
   if (file && file.attachment_url) {
    await interaction.reply(`${file.attachment_url} , uploaded on ${file.upload_date}`);
   }
   break;
  }
  case 'list': {
   const res = all_files.all() as Q.File[];
   const rows = res.length;
   const start = (cmd.options?.[0] ? cmd.options?.[0].value : 1) as number;
   const end = (cmd.options?.[1] ? cmd.options?.[1].value : rows < 10 ? res.length : 1) as number;

   if (start <= rows && rows >= end) {
    await interaction.reply({
     content: `>>> There are currently ${rows} saved files\n${res
      .slice(start - 1, end)
      .map(file => `${file.id}) ${file.attachment_url} - Uploaded on ${file.upload_date}`)
      .join('\n')}
      `,
     flags: ['SuppressEmbeds'],
    });
   } else if (end - start < 25) {
    await interaction.reply('Cannot list more than 25 files at a time!');
   } else {
    await interaction.reply('Cannot access non existent files. Either there are no available files or you need to provide a valid range.');
   }
   break;
  }
  case 'save': {
   const sub_option = cmd.options?.[0]?.options;

   if (cmd.options?.[0]?.name == 'fromdisk') {
    const res = await fetch(sub_option?.[0].attachment?.url as string);
    if (res.status < 400) {
     upload_file(sub_option?.[0].attachment?.name as string, sub_option?.[0].attachment?.url as string);
     await interaction.reply(`Successfully uploaded file! With id ${(all_files_count_query.get() as { rows: number }).rows}`);
    } else {
     await interaction.reply(log.error.command.upload_fetch);
    }
   } else {
    const url = sub_option?.[0].value as string;
    const file_name = sub_option?.[1].value as string;
    const res = await fetch(url);
    if (res.status < 400) {
     const buffer = Buffer.from(await res.arrayBuffer());
     const attachment = new AttachmentBuilder(buffer);
     const message = await interaction.reply({ content: "Successfully uploaded file! Here' the result:", files: [attachment], fetchReply: true });
     upload_file(file_name, Array.from(message.attachments.entries())[0][1].url as string);
    } else {
     await interaction.reply(log.error.command.upload_fetch);
    }
   }
   break;
  }
 }
}
