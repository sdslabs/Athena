import winston from "winston";
const loggerConfig = {
  sillyFile: process.env.VERBOSE_LOG_PATH || 'logs/silly.log',
  errorFile: process.env.ERROR_LOG_PATH || 'logs/error.log',
  warnFile: process.env.WARN_LOG_PATH || 'logs/warn.log',
  debugFile: process.env.DEBUG_LOG_LEVEL || 'logs/debug.log',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTransports = (config: any) => {
  const customTransports = [
    new winston.transports.File({
      filename: config.sillyFile,
      level: 'silly',
    }),
    new winston.transports.File({
      filename: config.errorFile,
      level: 'error',
    }),
    new winston.transports.File({
      filename: config.warnFile,
      level: 'warn',
    }),
    new winston.transports.File({
      filename: config.debugFile,
      level: 'debug',
    }),
  ];
  return customTransports;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = (config: any) => winston.createLogger({
  transports: createTransports(config),
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.label({
      label: 'Quizio Backend'
    }),
    winston.format.printf(
      (info) => `${info.label} (${info.timestamp}) [${info.level}] : ${info.message}`,
    ),
  ),
});


const logger = create(loggerConfig);

export default logger;