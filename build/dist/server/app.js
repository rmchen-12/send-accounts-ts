"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
const body_parser_1 = require("body-parser");
const compression_1 = require("compression");
const connect_history_api_fallback_1 = require("connect-history-api-fallback");
const connect_mongo_1 = require("connect-mongo");
const cors_1 = require("cors");
const dotenv_1 = require("dotenv");
const express_1 = require("express");
const express_session_1 = require("express-session");
const express_validator_1 = require("express-validator");
const lusca_1 = require("lusca");
const mongoose_1 = require("mongoose");
const env_config_1 = require("./env-config");
const utils_1 = require("./utils");
const logger_1 = require("./utils/logger");
// Controllers (route handlers)
const dataController = require("./controllers/data");
const excelController = require("./controllers/excel");
const imageController = require("./controllers/image");
const passwordController = require("./controllers/password");
// 加载配置文件
dotenv_1.default.config({ path: ".env" });
const MongoStore = connect_mongo_1.default(express_session_1.default);
const app = express_1.default();
// 连接mongoDb
const mongoUrl = env_config_1.MONGODB_URI;
mongoose_1.default.Promise = bluebird_1.default;
mongoose_1.default
    .connect(mongoUrl, { useNewUrlParser: true })
    .then(() => {
    logger_1.default.info("成功连接MongoDB");
})
    .catch(err => {
    logger_1.default.info("MongoDB连接出错" + err);
});
// express配置
app.set("port", process.env.POST || env_config_1.SERVER_PORT);
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_validator_1.default());
app.use(cors_1.default());
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: env_config_1.SESSION_SECRET,
    store: new MongoStore({
        autoReconnect: true,
        url: mongoUrl
    })
}));
app.use("/", connect_history_api_fallback_1.default());
app.use("/", express_1.default.static(utils_1.getPath("build"), { maxAge: 31557600000 }));
app.use("/", express_1.default.static(utils_1.getPath("static/image"), { maxAge: 31557600000 }));
app.get("/static/image/*", imageController.handleImage);
app.post("/uploadImg", imageController.uploadImage);
app.get("/getBanner", imageController.getBanner);
app.post("/getData", dataController.getData);
app.get("/getStat", dataController.getStat);
app.post("/updatePassWord", passwordController.updatePassword);
app.get("/getPassword", passwordController.getPassword);
app.post("/export", excelController.exportExcel);
app.post("/uploadExcel", excelController.uploadExcel);
exports.default = app;
//# sourceMappingURL=app.js.map