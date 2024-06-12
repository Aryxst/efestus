export default {
 // Either add folder or file names
 // Disable generic commands
 disabled: [] as string[],
 apis: {
  cat: 'https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1',
  dog: 'https://random.dog/woof.json',
 },
};
