import chalk from 'chalk';
import { RequestResponse } from 'request';

const log = (msg: string, addTimestamp = true): void => {
  let finalMsg = msg;

  if (addTimestamp) {
    const now = new Date();
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const timestamp = `[${chalk.gray(time)}]`;
    finalMsg = `${timestamp} ${msg}`;
  }
  process.stdout.write(`${finalMsg}\n`);

  function pad(num: number) {
    const val = num !== undefined ? num.toString() : '';
    return val.length >= 2 ? val : new Array(2 - val.length + 1).join('0') + val;
  }
};

export const debug = (msg: string): void => {
  log(chalk.cyan(msg));
};

export const info = (msg: string): void => {
  log(chalk.magenta(msg));
};

export const error = (msg: string): void => {
  log(chalk.red(msg));
};

export const logResponse = ({ method, request, statusCode }: RequestResponse): void => {
  const methodMsg = chalk.cyan(`${method || request.method} `.slice(0, 4));
  const statusMsg =
    statusCode >= 400 ? chalk.red(String(statusCode)) : chalk.green(String(statusCode));

  log(`${methodMsg} ${statusMsg} ${request.uri.href}`);
};
