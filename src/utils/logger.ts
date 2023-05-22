import winston from "winston";
const loggerConfig = {
  infoFile: process.env.INFO_LOG_PATH || 'logs/info.log',
  errorFile: process.env.ERROR_LOG_PATH || 'logs/error.log',
  debugFile: process.env.DEBUG_LOG_PATH || 'logs/debug.log',
  console: process.env.LOG_ENABLE_CONSOLE || true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTransports = (config: any) => {
  const customTransports = [
    new winston.transports.File({
      filename: config.infoFile,
      level: 'info',
    }),
    new winston.transports.File({
      filename: config.errorFile,
      level: 'error',
    }),
    new winston.transports.File({
      filename: config.debugFile,
      level: 'debug',
    })
  ];

  return customTransports;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = (config: any) => new winston.createLogger({
  transports: createTransports(config),
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.label({ label: 'Quizio Backend' }),
    winston.format.printf(
      (info) => `${info.label} (${info.timestamp}) [${info.level}] : ${info.message}`,
    ),
  ),
});


const logger = create(loggerConfig);

export default logger;