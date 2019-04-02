"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const logger_1 = require("./utils/logger");
dotenv_1.default.config({ path: ".env" });
exports.ENVIRONMENT = process.env.NODE_ENV;
const isEnvProduction = exports.ENVIRONMENT === "production";
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.SERVER_PORT = isEnvProduction
    ? process.env.PRODUCTION_PORT
    : process.env.DEVELOPMENT_PORT;
if (!exports.SESSION_SECRET) {
    logger_1.default.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}
if (!exports.MONGODB_URI) {
    logger_1.default.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
if (!exports.SERVER_PORT) {
    logger_1.default.error("No SERVER_PORT string. Set SERVER_PORT environment variable.");
    process.exit(1);
}
//# sourceMappingURL=env-config.js.map