import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config({ path: ".env" });

export const ENVIRONMENT = process.env.NODE_ENV;
const isEnvProduction = ENVIRONMENT === "production";

export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;
export const SERVER_PORT = isEnvProduction
  ? process.env.PRODUCTION_PORT
  : process.env.DEVELOPMENT_PORT;

if (!SESSION_SECRET) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
  process.exit(1);
}

if (!MONGODB_URI) {
  logger.error(
    "No mongo connection string. Set MONGODB_URI environment variable."
  );
  process.exit(1);
}

if (!SERVER_PORT) {
  logger.error("No SERVER_PORT string. Set SERVER_PORT environment variable.");
  process.exit(1);
}
