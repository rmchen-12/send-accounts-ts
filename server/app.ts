import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import compression from 'compression';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import mongo from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import expressValidator from 'express-validator';
import lusca from 'lusca';
import mongoose from 'mongoose';

import * as dataController from './controllers/data';
import * as excelController from './controllers/excel';
import * as imageController from './controllers/image';
import * as passwordController from './controllers/password';
import { MONGODB_URI, SERVER_PORT, SESSION_SECRET } from './env-config';
import { getPath } from './utils';
import logger from './utils/logger';

// Controllers (route handlers)

// 加载配置文件
dotenv.config({ path: ".env" });

const MongoStore = mongo(session);
const app = express();

// 连接mongoDb
const mongoUrl = MONGODB_URI;
(mongoose as any).Promise = bluebird;
mongoose
  .connect(mongoUrl!, { useNewUrlParser: true })
  .then(() => {
    logger.info("成功连接MongoDB");
  })
  .catch(err => {
    logger.info("MongoDB连接出错" + err);
  });

// express配置
app.set("port", process.env.POST || SERVER_PORT);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET!,
    store: new MongoStore({
      autoReconnect: true,
      url: mongoUrl!
    })
  })
);

app.use("/", connectHistoryApiFallback());
app.use("/", express.static(getPath("build"), { maxAge: 31557600000 }));
app.use("/", express.static(getPath("static/image"), { maxAge: 31557600000 }));

app.get("/static/image/*", imageController.handleImage);
app.post("/uploadImg", imageController.uploadImage);
app.get("/getBanner", imageController.getBanner);

app.post("/getData", dataController.getData);
app.post("/getStat", dataController.getStat);

app.post("/updatePassWord", passwordController.updatePassword);
app.get("/getPassword", passwordController.getPassword);

app.post("/export", excelController.exportExcel);
app.post("/uploadExcel", excelController.uploadExcel);

export default app;
