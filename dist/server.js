"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("errorhandler"));
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
// 只在开发环境生效，提供全栈的错误提示
app_1.default.use(errorhandler_1.default());
const server = app_1.default.listen(app_1.default.get("port"), "0.0.0.0", () => {
    logger_1.default.info(`App is running at http://localhost:${app_1.default.get("port")} in ${app_1.default.get("env")} mode`);
});
exports.default = server;
//# sourceMappingURL=server.js.map