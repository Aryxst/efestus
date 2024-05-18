import { SlashCommandBuilder, AttachmentBuilder, type AutocompleteInteraction, type CommandInteraction, EmbedBuilder } from 'discord.js';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import log from '@/lib/log';

const getUserFiles = (userId: number) => db.select().from(schema.file).where(eq(schema.file.ownerId, userId)).all();
export const data = new SlashCommandBuilder()
 .setName('db')
 .setDescription('Interact with the public database.')
 .addSubcommand(cmd =>
  cmd
   .setName('get')
   .setDescription('Get a file from the database.')
   .addStringOption(option => option.setName('name').setDescription('The name of the file.').setAutocomplete(true).setRequired(true)),
 )
 .addSubcommand(cmd =>
  cmd
   .setName('delete')
   .setDescription('Delete a file from the database.')
   .addStringOption(option => option.setName('name').setDescription('The name of the file.').setAutocomplete(true).setRequired(true)),
 )
 .addSubcommand(cmd =>
  cmd
   .setName('list')
   .setDescription('List files in a given range.')
   .addIntegerOption(option => option.setName('start').setDescription('Defaults to 0.'))
   .addIntegerOption(option => option.setName('end').setDescription('Defaults to MAX=25 MIN=YOUR_FILES.')),
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
     .addStringOption(option => option.setName('name').setDescription('New name for the file, not required.')),
   )
   .addSubcommand(cmd =>
    cmd
     .setName('fromurl')
     .setDescription('Source the file from a url.')
     .addStringOption(option => option.setName('url').setDescription('The url of the file to upload.').setRequired(true))
     .addStringOption(option => option.setName('name').setDescription('The name of the file, with extension.').setRequired(true)),
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
    embeds: [
     new EmbedBuilder()
      .setTitle(file.name)
      .setDescription(`${file.attachmentUrl} - Uploaded on ${new Date(file.uploadedAt).toLocaleDateString('en-US')}`),
    ],
    ephemeral: true,
   });
   break;
  }
  case 'list': {
   const files = getUserFiles(+interaction.user.id);
   const rows = files.length;
   const start = interaction.options.getInteger('start') || 0;
   const end = interaction.options.getInteger('end') || files.length > 25 ? 25 : files.length;

   if (start <= rows && rows >= end) {
    await interaction.reply({
     embeds: [
      new EmbedBuilder()
       .setTitle('Your files')
       .setDescription(
        `${files.map((file, i) => `${i + 1}) ${file.attachmentUrl} - Uploaded on ${new Date(file.uploadedAt).toLocaleDateString('en-US')}`).join('\n')}
    `,
       )
       .setFooter({ text: `You currently have ${rows} saved files` }),
     ],
    });
   } else if (end - start < 25 && end - start > 0) {
    await interaction.reply('Cannot list more than 25 files at a time!');
   } else {
    await interaction.reply("Either there are no available files or you didn't provide a valid range.");
   }
   break;
  }
  case 'save': {
   if (interaction.options.getSubcommand() == 'fromdisk') {
    const attachment = interaction.options.getAttachment('file', true);
    await db.insert(schema.file).values({ name: attachment.name, attachmentUrl: attachment.url, ownerId: +interaction.user.id });
    await interaction.reply({ content: `Successfully uploaded file!`, ephemeral: true });
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
     await db.insert(schema.file).values({ name: attachment.name!, attachmentUrl, ownerId: +interaction.user.id });
    } else {
     await interaction.reply('Error while fetching resource, is the url correct?');
    }
   }
   break;
  }
  case 'delete': {
   const files = getUserFiles(+interaction.user.id);
   const index = interaction.options.getString('name', true);
   const file = files[+index];
   try {
    await db.delete(schema.file).where(eq(schema.file.id, file.id));
    await interaction.reply({
     embeds: [new EmbedBuilder().setTitle('Successful deletion!').setColor(0x22c55e).setDescription(`Successfully deleted ${file.name}!`)],
     ephemeral: true,
    });
   } catch (error) {
    log('e', error);
   }
  }
 }
}
export async function autocomplete(interaction: AutocompleteInteraction<any>) {
 switch (interaction.options.getSubcommand()) {
  case 'delete': {
   if (!interaction.isAutocomplete()) return;
   const focusedValue = interaction.options.getFocused();
   const files = getUserFiles(+interaction.user.id);
   const choices = files.map((file, i) => ({ name: file.name, value: i.toString() }));
   const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
   await interaction.respond(filtered);
   break;
  }
  case 'get': {
   if (!interaction.isAutocomplete()) return;
   const focusedValue = interaction.options.getFocused();
   const files = getUserFiles(+interaction.user.id);
   const choices = files.map((file, i) => ({ name: file.name, value: i.toString() }));
   const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
   await interaction.respond(filtered);
   break;
  }
  default:
   break;
 }
}
