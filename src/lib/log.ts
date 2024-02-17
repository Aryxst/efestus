import chalk from 'chalk';

type LogTypes = 'w' | 'e' | 'i' | 'r' | 'd';

const LogBinds: Record<LogTypes, string> = { w: chalk.yellow('[WARN]'), e: chalk.red('[ERROR]'), i: chalk.cyan('[INFO]'), r: chalk.green('[READY]'), d: chalk.gray('[DEBUG]') };

export default Object.assign(
 <Log>(type: LogTypes, msg: Log, ...args: Array<any>) => {
  console.log(`${LogBinds[type]} - ${msg}`, ...args, `| ${new Date().toLocaleTimeString()}`);
 },
 {
  error: {
   client: { login: 'Failed to login!' },
   command: {
    execute: 'There was an error while executing this command!',
    uploadfetch: { content: 'Error while fetching resource, is the url correct?', ephemeral: true },
   },
  },
  info: {
   table: {
    /** 1: property 2: table name 3: row id */
    update_entry: 'Successfully updated property %s in table %s on row %s',
    /** 1: row id 2: table name */
    not_exist: 'File with id "%s" doesn\'t exist in table %s.',
   },
  },
 }
);
