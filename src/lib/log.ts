import chalk from 'chalk';

type LogType = 'w' | 'e' | 'i' | 'r' | 'd';
const LogBinds: Record<LogType, string> = { w: chalk.yellow('[WARN]'), e: chalk.red('[ERROR]'), i: chalk.cyan('[INFO]'), r: chalk.green('[READY]'), d: chalk.gray('[DEBUG]') };

export default Object.assign(
 (type: LogType, msg: any, ...args: any[]) => {
  console.log(`${LogBinds[type]} - ${msg}`, ...args, `| ${new Date().toLocaleTimeString()}`);
 },
 {
  error: {
   client: { login: 'Failed to login!' },
   command: {
    execute: 'There was an error while executing this command!',
   },
  },
 }
);
