"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moment_1 = require("moment");
const accounts_1 = require("../models/accounts");
const password_1 = require("../models/password");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
exports.getData = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const { nickName, getNumber, password } = req.body;
    try {
        const passwords = yield password_1.Password.find();
        // 校验密码
        if (password && Number(passwords[0].password) !== Number(password)) {
            utils_1.responseClient(res, 200, 1, "口令有误哦");
            return;
        }
        let index;
        const oldSendAccount = yield accounts_1.Accounts.find({ hasSend: true });
        if (oldSendAccount.length === 0) {
            index = 0;
        }
        else {
            oldSendAccount.sort((pre, current) => current.id - pre.id);
            index = oldSendAccount[0].id;
        }
        yield accounts_1.Accounts.updateMany({
            hasSend: false,
            id: { $gt: index, $lte: index + Number(getNumber) }
        }, {
            getTime: moment_1.default().format("YYYY-MM-DD"),
            hasSend: true,
            nickName
        });
        const newSendAccount = yield accounts_1.Accounts.find({ hasSend: true });
        newSendAccount.sort((pre, current) => pre.id - current.id);
        logger_1.default.info(`user:${nickName}  number:${getNumber}`);
        utils_1.responseClient(res, 200, 0, "更新成功", newSendAccount.slice(index));
    }
    catch (error) {
        utils_1.responseClient(res);
        if (error) {
            return next(error);
        }
    }
});
exports.getStat = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const stat = {};
    stat.countDTO = [];
    try {
        const totalNumber = yield accounts_1.Accounts.countDocuments({});
        const todayTotalNumber = yield accounts_1.Accounts.countDocuments({
            uploadTime: moment_1.default().format("YYYY-MM-DD")
        });
        const todaySendNumber = yield accounts_1.Accounts.countDocuments({
            hasSend: true,
            uploadTime: moment_1.default().format("YYYY-MM-DD")
        });
        const leaveAccountNumber = yield accounts_1.Accounts.countDocuments({
            hasSend: false
        });
        const passwords = yield password_1.Password.find({});
        stat.hasPassword = passwords[0].password ? true : false;
        stat.todayTotalNumber = todayTotalNumber;
        stat.todaySendNumber = todaySendNumber;
        stat.totalNumber = totalNumber;
        stat.leaveAccountNumber = leaveAccountNumber;
        const aAccounts = yield accounts_1.Accounts.find({ hasSend: true, getTime: moment_1.default().format("YYYY-MM-DD") }, "nickName");
        const allNickNames = aAccounts.map(v => v.nickName);
        const nickNames = [...new Set(allNickNames)];
        nickNames.forEach(name => {
            const count = utils_1.countName(allNickNames, name);
            stat.countDTO.push({ name, count });
        });
        utils_1.responseClient(res, 200, 0, "统计成功", stat);
    }
    catch (error) {
        utils_1.responseClient(res);
        if (error) {
            return next(error);
        }
    }
});
//# sourceMappingURL=data.js.map