"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const password_1 = require("../models/password");
const utils_1 = require("../utils");
exports.updatePassword = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const { password } = req.body;
    const passwords = yield password_1.Password.find();
    yield password_1.Password.updateOne({ password: passwords[0].password }, { password });
    utils_1.responseClient(res, 200, 0, "更新成功");
});
exports.getPassword = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const passwords = yield password_1.Password.find();
    utils_1.responseClient(res, 200, 0, "success", passwords[0].password);
});
//# sourceMappingURL=password.js.map