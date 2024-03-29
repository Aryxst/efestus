// WARNING: Kind of broken, only use with bot logs: not /scripts logs.
import chalk from 'chalk';
// Define error types
type LogTypes = 'w' | 'e' | 'i' | 'r' | 'd';
// Bind each log type to a color
const LogBinds: Record<LogTypes, string> = { w: chalk.yellow('[WARN]'), e: chalk.red('[ERROR]'), i: chalk.cyan('[INFO]'), r: chalk.green('[READY]'), d: chalk.gray('[DEBUG]') };
// This function is used to log messages, they are all outputted to the console as a base log(no level)
export default Object.assign(
 <Log>(type: LogTypes, msg: Log, ...args: Array<any>) => {
  console.log(`${LogBinds[type]} - ${msg}`, ...args, `| ${new Date().toLocaleTimeString()}`);
 },
 {
  error: {
   client: { login: 'Failed to login!' },
   command: {
    execute: { content: 'There was an error while executing this command!', ephemeral: true },
    upload_fetch: { content: 'Error while fetching resource, is the url correct?', ephemeral: true },
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
