import chalk from 'chalk';

type LogType = 'w' | 'e' | 'i' | 'r' | 'd';
const LogBinds: Record<LogType, string> = { w: chalk.yellow('[WARN]'), e: chalk.red('[ERROR]'), i: chalk.cyan('[INFO]'), r: chalk.green('[READY]'), d: chalk.gray('[DEBUG]') };

const logger = (type: LogType, msg: string | string[], ...args: any[]) => {
 console.error(`${LogBinds[type]} - ${msg}`, ...args, `| ${new Date().toLocaleTimeString()}`);
};

export default Object.assign(logger, {
 error: {
  login: 'Failed to login!',
 },
});
