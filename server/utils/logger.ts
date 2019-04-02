import winston from "winston";
import { createLogger, format, Logger } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}] [${label}] [${level}]: ${message}`;
});

const logger: Logger = createLogger({
  format: combine(
    label({ label: "right meow!" }),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
    myFormat
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug"
    }),
    new winston.transports.File({ filename: "debug.log", level: "debug" })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;
