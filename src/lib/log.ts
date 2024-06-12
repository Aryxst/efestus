type LogType = 'w' | 'e' | 'i' | 'r' | 'd';

const LogBinds: Record<LogType, string> = {
 w: '\x1b[33m[WARN]\x1b[0m',
 e: '\x1b[31m[ERROR]\x1b[0m',
 i: '\x1b[36m[INFO]\x1b[0m',
 r: '\x1b[32m[READY]\x1b[0m',
 d: '\x1b[90m[DEBUG]\x1b[0m',
};
function log<Log>(type: LogType, msg: Log, ...args: Array<any>) {
 console.log(`${new Date().toLocaleTimeString()} ${LogBinds[type]} - ${msg}`, ...args);
}

export { log };
