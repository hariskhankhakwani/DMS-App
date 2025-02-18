import pino, { type Logger as Pino } from 'pino';
import type { LoggerOptions } from 'pino';
import { injectable } from 'inversify';
import type { ILogger } from '../../app/ports/logger/ILogger';

@injectable()
export class PinoLogger implements ILogger {
  private logger: Pino;

  constructor(options?: LoggerOptions) {
    this.logger = pino(options);
  }

  info(message: string): void {
    this.logger.info({ message });
  }

  error(message: string): void {
    this.logger.error({ message });
  }

  debug(message: string): void {
    this.logger.debug({ message });
  }

  warn(message: string): void {
    this.logger.warn({ message });
  }
}
