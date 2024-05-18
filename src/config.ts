export default {
 // Either add folder or file names
 // Disable generic commands because this will not be a generic utility bot, at least that's why i made it to be
 disabled: [] as string[],
 apis: {
  cat: 'https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1',
  dog: 'https://random.dog/woof.json',
 },
};
