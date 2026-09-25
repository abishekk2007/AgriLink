import { config } from '../config/env.config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'http';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  http: 1,
  info: 2,
  warn: 3,
  error: 4,
};

// ANSI color codes for terminal formatting
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: COLORS.dim + COLORS.cyan,
  http: COLORS.magenta,
  info: COLORS.green,
  warn: COLORS.yellow,
  error: COLORS.red,
};

class Logger {
  private currentPriority: number;

  constructor() {
    const configLevel = config.logging.level as LogLevel;
    this.currentPriority = LOG_LEVEL_PRIORITY[configLevel] ?? LOG_LEVEL_PRIORITY.info;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= this.currentPriority;
  }

  private formatMessage(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const color = LEVEL_COLORS[level];
    const prefix = `${COLORS.dim}[${timestamp}]${COLORS.reset} ${color}[${level.toUpperCase()}]${COLORS.reset}`;
    const formattedMeta = meta !== undefined
      ? `\n${typeof meta === 'object' ? JSON.stringify(meta, null, 2) : meta}`
      : '';

    return `${prefix} ${message}${formattedMeta}`;
  }

  debug(message: string, meta?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, meta));
    }
  }

  http(message: string, meta?: unknown): void {
    if (this.shouldLog('http')) {
      console.log(this.formatMessage('http', message, meta));
    }
  }

  warn(message: string, meta?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  error(message: string, meta?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, meta));
    }
  }
}

export const logger = new Logger();
