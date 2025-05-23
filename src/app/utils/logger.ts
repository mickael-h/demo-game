type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;
  private isDebug: boolean = false;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setDebug(enabled: boolean): void {
    this.isDebug = enabled;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
  }

  public info(message: string, data?: any): void {
    console.log(this.formatMessage('info', message, data));
  }

  public warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  public error(message: string, data?: any): void {
    console.error(this.formatMessage('error', message, data));
  }

  public debug(message: string, data?: any): void {
    if (this.isDebug) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }
}

export const logger = Logger.getInstance(); 
