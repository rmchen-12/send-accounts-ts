import errorHandler from "errorhandler";
import app from "./app";
import logger from "./utils/logger";

// 只在开发环境生效，提供全栈的错误提示
app.use(errorHandler());

const server = app.listen(app.get("port"), "0.0.0.0", () => {
  logger.info(
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
});

export default server;
