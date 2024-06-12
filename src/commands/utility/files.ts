import { db, schema } from '@/db';
import { log } from '@/lib/log';
import {
 type AutocompleteInteraction,
 type CommandInteraction,
 AttachmentBuilder,
 EmbedBuilder,
 SlashCommandBuilder,
} from 'discord.js';
import { and, eq, lte } from 'drizzle-orm';

const getUserFiles = (userId: number) =>
 db.select().from(schema.file).where(eq(schema.file.ownerId, userId)).all();

export const data = new SlashCommandBuilder()
 .setName('db')
 .setDescription('Interact with the attachment database.')
 .addSubcommand(cmd =>
  cmd
   .setName('get')
   .setDescription('Get a file from the database.')
   .addStringOption(option =>
    option
     .setName('name')
     .setDescription('The name of the file.')
     .setAutocomplete(true)
     .setRequired(true),
   ),
 )
 .addSubcommand(cmd =>
  cmd
   .setName('delete')
   .setDescription('Delete a file from the database.')
   .addStringOption(option =>
    option
     .setName('name')
     .setDescription('The name of the file.')
     .setAutocomplete(true)
     .setRequired(true),
   ),
 )
 .addSubcommand(cmd =>
  cmd
   .setName('bulk_delete')
   .setDescription('Bulk deletes files from the database.')
   .addIntegerOption(option =>
    option
     .setName('older_than')
     .setDescription('A filter to only delete files older than "x" days.')
     .setMinValue(1)
     /**I'm not so sure of the attachment's lifetime. Going to put it at 30 days for now */
     .setMaxValue(30)
     .setRequired(true),
   ),
 )
 .addSubcommand(cmd =>
  cmd
   .setName('list')
   .setDescription('List files in a given range.')
   .addIntegerOption(option =>
    option.setName('start').setDescription('Defaults to 0.'),
   )
   .addIntegerOption(option =>
    option.setName('end').setDescription('Defaults to MAX=25 MIN=YOUR_FILES.'),
   ),
 )
 .addSubcommandGroup(group =>
  group
   .setName('save')
   .setDescription('Upload a file to the database.')
   .addSubcommand(cmd =>
    cmd
     .setName('fromdisk')
     .setDescription('Source the file from disk.')
     .addAttachmentOption(option =>
      option
       .setName('file')
       .setDescription('The file from your disk to upload.')
       .setRequired(true),
     )
     .addStringOption(option =>
      option
       .setName('name')
       .setDescription('New name for the file, not required.'),
     ),
   )
   .addSubcommand(cmd =>
    cmd
     .setName('fromurl')
     .setDescription('Source the file from a url.')
     .addStringOption(option =>
      option
       .setName('url')
       .setDescription('The url of the file to upload.')
       .setRequired(true),
     )
     .addStringOption(option =>
      option
       .setName('name')
       .setDescription('The name of the file, with extension.')
       .setRequired(true),
     ),
   ),
 );

export async function execute(interaction: CommandInteraction<any>) {
 if (!interaction.isChatInputCommand()) return;
 const subcommandName = interaction.options.data.at(0)?.name;
 switch (subcommandName) {
  case 'get': {
   const files = getUserFiles(+interaction.user.id);
   const index = interaction.options.getString('name', true);
   const file = files[+index];
   await interaction.reply({
    files: [
     new AttachmentBuilder(
      Buffer.from(await (await fetch(file.attachmentUrl)).arrayBuffer()),
      {
       name: file.name,
      },
     ),
    ],
    ephemeral: true,
   });
   break;
  }
  case 'delete': {
   const files = getUserFiles(+interaction.user.id);
   const index = interaction.options.getString('name', true);
   const file = files[+index];
   try {
    await db.delete(schema.file).where(eq(schema.file.id, file.id));
    await interaction.reply({
     embeds: [
      new EmbedBuilder()
       .setTitle('Successful deletion!')
       .setColor(0x22c55e)
       .setDescription(`Successfully deleted ${file.name}!`),
     ],
     ephemeral: true,
    });
   } catch (error) {
    log('e', error);
   }
   break;
  }
  case 'bulk_delete': {
   const files = getUserFiles(+interaction.user.id);
   const olderThan = interaction.options.getInteger('older_than', true);
   if (files.length === 0) {
    await interaction.reply({
     embeds: [
      new EmbedBuilder()
       .setTitle('No files to delete!')
       .setColor(0xb91c1c)
       .setDescription('You have no files saved!'),
     ],
     ephemeral: true,
    });
   }
   try {
    const res = await db
     .delete(schema.file)
     .where(
      and(
       lte(
        schema.file.createdAt,
        new Date(Date.now() - olderThan * 24 * 60 * 60 * 1000),
       ),
       eq(schema.file.ownerId, +interaction.user.id),
      ),
     )
     .returning()
     .execute();
    console.log(res);
    await interaction.reply({
     embeds: [
      new EmbedBuilder()
       .setTitle('Successful deletion!')
       .setColor(0x22c55e)
       .setDescription(`Successfully deleted ${res.length} files!`),
     ],
     ephemeral: true,
    });
   } catch (error) {
    log('e', error);
   }
   break;
  }
  case 'list': {
   const files = getUserFiles(+interaction.user.id);
   const rows = files.length;
   const start = interaction.options.getInteger('start') || 0;
   const end =
    interaction.options.getInteger('end') || files.length > 25
     ? 25
     : files.length;

   if (start <= rows && rows >= end) {
    await interaction.reply({
     embeds: [
      new EmbedBuilder()
       .setTitle('Your files')
       .setDescription(
        `${files.map((file, index) => `${index + 1}) ${file.attachmentUrl} - Uploaded on ${new Date(file.createdAt).toLocaleDateString('en-US')}`).join('\n')}
    `,
       )
       .setFooter({ text: `You currently have ${rows} saved files` }),
     ],
     ephemeral: true,
    });
   } else if (end - start < 25 && end - start > 0) {
    await interaction.reply('Cannot list more than 25 files at a time!');
   } else {
    await interaction.reply(
     "Either there are no available files or you didn't provide a valid range.",
    );
   }
   break;
  }
  case 'save': {
   if (interaction.options.getSubcommand() == 'fromdisk') {
    const attachment = interaction.options.getAttachment('file', true);
    await db.insert(schema.file).values({
     name: attachment.name,
     attachmentUrl: attachment.url,
     ownerId: +interaction.user.id,
    });
    await interaction.reply({
     content: `Successfully uploaded file!`,
     ephemeral: true,
    });
   } else {
    const url = interaction.options.getString('url', true);
    const fileName = interaction.options.getString('name', true);
    const res = await fetch(url);

    if (res.status < 400) {
     const buffer = Buffer.from(await res.arrayBuffer());
     const attachment = new AttachmentBuilder(buffer, { name: fileName });
     const message = await interaction.reply({
      content: "Successfully uploaded file! Here's the result:",
      files: [attachment],
      fetchReply: true,
      ephemeral: true,
     });
     const attachmentUrl = message.attachments.at(0)?.url!;
     await db.insert(schema.file).values({
      name: attachment.name!,
      attachmentUrl,
      ownerId: +interaction.user.id,
     });
    } else {
     await interaction.reply({
      content: 'Error while fetching resource, is the url correct?',
      ephemeral: true,
     });
    }
   }
   break;
  }
 }
}
export async function autocomplete(interaction: AutocompleteInteraction<any>) {
 switch (interaction.options.getSubcommand()) {
  case 'get': {
   if (!interaction.isAutocomplete()) return;
   const focusedValue = interaction.options.getFocused();
   const files = getUserFiles(+interaction.user.id);
   const choices = files.map((file, index) => ({
    name: file.name,
    value: index.toString(),
   }));
   const filtered = choices.filter(choice =>
    choice.name.startsWith(focusedValue),
   );
   await interaction.respond(filtered);
   break;
  }
  case 'delete': {
   if (!interaction.isAutocomplete()) return;
   const focusedValue = interaction.options.getFocused();
   const files = getUserFiles(+interaction.user.id);
   const choices = files.map((file, index) => ({
    name: file.name,
    value: index.toString(),
   }));
   const filtered = choices.filter(choice =>
    choice.name.startsWith(focusedValue),
   );
   await interaction.respond(filtered);
   break;
  }
 }
}
