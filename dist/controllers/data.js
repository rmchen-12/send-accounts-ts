"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const accounts_1 = require("../models/accounts");
const password_1 = require("../models/password");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
exports.getData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { nickName, amount, password } = req.body;
    try {
        if (!amount) {
            return;
        }
        const passwords = yield password_1.Password.find();
        // 校验密码
        if (password &&
            Number(passwords[0] && passwords[0].password) !== Number(password)) {
            utils_1.responseClient(res, 200, 1, "口令有误哦");
            return;
        }
        if (Number(amount) === 0) {
            utils_1.responseClient(res, 200, 1, "不能选择0个哦");
            return;
        }
        // 更新amount条数据并返回
        const noSendAccount = yield accounts_1.Accounts.find({ hasSend: false })
            .sort({
            id: 1
        })
            .limit(amount);
        noSendAccount.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
            yield accounts_1.Accounts.updateOne({
                _id: doc._id
            }, {
                $set: {
                    getTime: moment_1.default().format("YYYY-MM-DD"),
                    hasSend: true,
                    nickName
                }
            });
        }));
        logger_1.default.info(`user:${nickName}  number:${amount} password:${password}`);
        utils_1.responseClient(res, 200, 0, "更新成功", noSendAccount);
    }
    catch (error) {
        utils_1.responseClient(res);
        if (error) {
            return next(error);
        }
    }
});
exports.getStat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const stat = {};
    stat.countDTO = [];
    try {
        const totalNumber = yield accounts_1.Accounts.countDocuments({});
        const todayTotalNumber = yield accounts_1.Accounts.countDocuments({
            uploadTime: moment_1.default().format("YYYY-MM-DD")
        });
        const todaySendNumber = yield accounts_1.Accounts.countDocuments({
            hasSend: true,
            getTime: moment_1.default().format("YYYY-MM-DD")
        });
        const leaveAccountNumber = yield accounts_1.Accounts.countDocuments({
            hasSend: false
        });
        const passwords = yield password_1.Password.find({});
        stat.hasPassword = passwords[0] && passwords[0].password ? true : false;
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