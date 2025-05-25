const LOG_PREFIX = "[Demo Game]";

export const logger = {
  info: (message: string, data?: unknown): void => {
    console.log(`${LOG_PREFIX} ${message}${data ? " " + JSON.stringify(data) : ""}`);
  },

  warn: (message: string, data?: unknown): void => {
    console.warn(`${LOG_PREFIX} ${message}${data ? " " + JSON.stringify(data) : ""}`);
  },

  error: (message: string, data?: unknown): void => {
    console.error(`${LOG_PREFIX} ${message}${data ? " " + JSON.stringify(data) : ""}`);
  },

  debug: (message: string, data?: unknown): void => {
    console.debug(`${LOG_PREFIX} ${message}${data ? " " + JSON.stringify(data) : ""}`);
  },
};
