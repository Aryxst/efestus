import { Glob } from 'bun';
const glob = new Glob('*.{ts}');

console.log(Array.from(glob.scanSync({ cwd: './src/commands/utility' })));
