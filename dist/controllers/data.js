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
const async_lock_1 = __importDefault(require("async-lock"));
const dayjs_1 = __importDefault(require("dayjs"));
const accounts_1 = require("../models/accounts");
const password_1 = require("../models/password");
const taskAccounts_1 = require("../models/taskAccounts");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const lock = new async_lock_1.default();
exports.getData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { nickName, amount, password, type } = req.body;
    try {
        if (!amount) {
            return;
        }
        const passwords = yield password_1.Password.find();
        // 校验密码
        if (type === "fight") {
            if (password &&
                Number(passwords[0].password) !==
                    Number(password.slice(0, password.length - 1))) {
                utils_1.responseClient(res, 200, 1, "口令有误哦");
                return;
            }
        }
        else {
            if (password && Number(passwords[0].password) !== Number(password)) {
                utils_1.responseClient(res, 200, 1, "口令有误哦");
                return;
            }
        }
        if (Number(amount) === 0) {
            utils_1.responseClient(res, 200, 1, "不能选择0个哦");
            return;
        }
        // 更新amount条数据并返回
        lock
            .acquire("updateAccounts", () => __awaiter(this, void 0, void 0, function* () {
            const noSendAccount = type === "fight"
                ? yield _update(taskAccounts_1.TaskAccounts, amount, nickName)
                : yield _update(accounts_1.Accounts, amount, nickName);
            logger_1.default.info(`user:${nickName}  number:${amount} password:${password}`);
            return noSendAccount;
        }))
            .then(noSendAccount => {
            utils_1.responseClient(res, 200, 0, "更新成功", noSendAccount);
        })
            .catch(err => {
            logger_1.default.error(err.message);
        });
    }
    catch (error) {
        utils_1.responseClient(res);
        if (error) {
            return next(error);
        }
    }
});
function _update(model, amount, nickName) {
    return __awaiter(this, void 0, void 0, function* () {
        // 更新amount条数据并返回
        const noSendAccount = yield model
            .find({ hasSend: false })
            .sort({
            id: 1
        })
            .limit(amount);
        noSendAccount.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
            yield model.updateOne({
                _id: doc._id
            }, {
                $set: {
                    getTime: dayjs_1.default().format("YYYY-MM-DD"),
                    hasSend: true,
                    nickName
                }
            });
        }));
        return noSendAccount;
    });
}
exports.getStat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { type } = req.body;
    const stat = {};
    stat.countDTO = [];
    try {
        const { totalNumber, todayTotalNumber, todaySendNumber, leaveAccountNumber, aAccounts } = type === "fight"
            ? yield _getStat(taskAccounts_1.TaskAccounts)
            : yield _getStat(accounts_1.Accounts);
        let passwords;
        passwords = yield password_1.Password.find();
        if (passwords.length === 0) {
            yield password_1.Password.create({ password: "" });
        }
        passwords = yield password_1.Password.find();
        stat.hasPassword = passwords[0].password ? true : false;
        stat.todayTotalNumber = todayTotalNumber;
        stat.todaySendNumber = todaySendNumber;
        stat.totalNumber = totalNumber;
        stat.leaveAccountNumber = leaveAccountNumber;
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
function _getStat(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalNumber = yield model.countDocuments({});
        const todayTotalNumber = yield model.countDocuments({
            uploadTime: dayjs_1.default().format("YYYY-MM-DD")
        });
        const todaySendNumber = yield model.countDocuments({
            hasSend: true,
            getTime: dayjs_1.default().format("YYYY-MM-DD")
        });
        const leaveAccountNumber = yield model.countDocuments({
            hasSend: false
        });
        const aAccounts = yield model.find({ hasSend: true, getTime: dayjs_1.default().format("YYYY-MM-DD") }, "nickName");
        return {
            totalNumber,
            todayTotalNumber,
            todaySendNumber,
            leaveAccountNumber,
            aAccounts
        };
    });
}
//# sourceMappingURL=data.js.map