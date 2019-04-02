"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_2 = require("winston");
const { combine, timestamp, label, printf } = winston_2.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}] [${label}] [${level}]: ${message}`;
});
const logger = winston_2.createLogger({
    format: combine(label({ label: "right meow!" }), timestamp({ format: "YYYY-MM-DD hh:mm:ss" }), myFormat),
    transports: [
        new winston_1.default.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        }),
        new winston_1.default.transports.File({ filename: "debug.log", level: "debug" })
    ]
});
if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}
exports.default = logger;
//# sourceMappingURL=logger.js.map