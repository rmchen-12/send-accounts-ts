"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_1 = require("../models/password");
const utils_1 = require("../utils");
exports.updatePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { password } = req.body;
    const passwords = yield password_1.Password.find();
    yield password_1.Password.updateOne({ password: passwords[0].password }, { password });
    utils_1.responseClient(res, 200, 0, "更新成功");
});
exports.getPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const passwords = yield password_1.Password.find();
    utils_1.responseClient(res, 200, 0, "success", passwords[0].password);
});
//# sourceMappingURL=password.js.map