import winston, { Logger, createLogger, format, transports, LoggerOptions, config, addColors } from 'winston';
import { Format } from 'logform';
import * as Transport from 'winston-transport';
import { AbstractConfigSetLevels } from 'winston/lib/winston/config';
import { FileTransportOptions } from 'winston/lib/winston/transports';
import { isDev } from 'src/utils/utils';

export class LoggerConfig {
  private readonly levels: AbstractConfigSetLevels;

  private readonly filesConfig: FileTransportOptions;

  private readonly colors: config.AbstractConfigSetColors;

  private readonly timestamp: Format;
  private readonly colorize: Format;
  private readonly print: Format;
  private readonly format: Format;

  private readonly transports: Transport[];
  private readonly options: LoggerOptions;

  private readonly _logger: Logger;

  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      verbose: 4,
      debug: 5,
      silly: 6,
    };

    this.filesConfig = {
      handleExceptions: true,
      maxsize: 52428800,
      maxFiles: 5,
    };

    this.colors = this.setColors();

    this.timestamp = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });
    this.colorize = format.colorize({ level: true });
    this.print = format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);
    this.format = format.combine(this.timestamp, this.colorize, this.print);

    this.transports = this.setTransports();
    this.options = this.setOptions();

    addColors(this.colors);
    this._logger = createLogger(this.options);
    // this._logger.stream({ write: (message: string) => this.logger.info(message.trim()) });
  }

  get logger() {
    return this._logger;
  }

  private setTransports() {
    return isDev()
      ? [new transports.Console({ level: 'debug', format: this.format })]
      : [
        new transports.File({ filename: 'logs/all.log', ...this.filesConfig }),
        new transports.File({ filename: 'logs/error.log', level: 'error', ...this.filesConfig }),
        new transports.Console({ level: 'debug', format: this.format }),
      ];
  }

  private setOptions(): LoggerOptions {
    return {
      level: process.env.NODE_ENV?.includes('development') ? 'debug' : 'info',
      levels: this.levels,
      format: this.format,
      transports: this.transports,
      exitOnError: false,
    };
  }

  private setColors(): config.AbstractConfigSetColors {
    return {
      error: 'red',
      warn: 'yellow',
      info: isDev() ? 'cyan' : 'green',
      http: isDev() ? 'green' : 'cyan',
      debug: ['black', 'bgWhite'],
    };
  }
}
