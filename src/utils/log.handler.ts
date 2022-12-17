import { debug, error, log, warn } from "console";
import { title } from "process";
import { stringify } from "querystring";
import { LoggerConfig } from "src/config/logger.config";
import { isDev } from "./utils";

const logger = new LoggerConfig().logger;

const TERMINAL_COLORS = {
  reset: '\x1b[0m',

  black: '\x1b[30m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',

  blackBg: '\x1b[40m',
  redBg: '\x1b[41m',
  greenBg: '\x1b[42m',
  yellowBg: '\x1b[43m',
  blueBg: '\x1b[44m',
  magentaBg: '\x1b[45m',
  cyanBg: '\x1b[46m',
  whiteBg: '\x1b[47m',
};


const isDebug = process.env.DEBUG === 'true';

export const onDebug = (...args: any[]) => {
  const { reset, cyanBg, black, cyan } = TERMINAL_COLORS;
  const [title, ...rest] = args;

  if (isDev()) return debug(`${cyanBg + black} DEBUG: ${reset}`, title, cyan, ...rest, reset);
  if (isDebug) return logger.debug(title, ...rest);
  return;
}

export const onLog = (...args: any[]) => {
  const { reset, whiteBg, black, cyan } = TERMINAL_COLORS;
  const [title, ...rest] = args;

  if (isDev()) return log(`${whiteBg + black} LOG: ${reset}`, `${cyan}${title}${reset}`, ...rest);
  if (isDebug) return logger.log(title, stringify(...rest));
  return;
}

export const onWarn = (...args: any[]) => {
  const { reset, yellowBg, black, yellow } = TERMINAL_COLORS;
  const [message, ...rest] = args;

  if (isDev()) return warn(`${yellowBg + black} WARN: ${reset}`, `${yellow}${message}${reset}`, ...rest);
  return logger.warn(title, ...rest);
}

export const onError = (...args: any[]) => {
  const { reset, red, redBg, black } = TERMINAL_COLORS;
  const [message, ...rest] = args;

  if (isDev()) return error(`${redBg + black} ERROR: ${reset}`, message, red, ...rest, reset);
  return logger.error(message, ...rest);
}

export const onHttp = (...args: any[]) => logger.http(stringify(...args));
