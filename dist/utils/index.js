"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.getPath = (file) => path_1.default.join(__dirname, "../..", file);
exports.responseClient = (res, httpCode = 500, code = 3, message = "服务端异常", data = {}) => {
    const responseData = {};
    responseData.code = code;
    responseData.message = message;
    responseData.data = data;
    res.status(httpCode).json(responseData);
};
exports.countName = (arr, item) => {
    const count = arr.filter((a) => {
        return a === item;
    });
    return count.length;
};
//# sourceMappingURL=index.js.map