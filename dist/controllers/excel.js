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
const dayjs_1 = __importDefault(require("dayjs"));
const ejsexcel_1 = __importDefault(require("ejsexcel"));
const fs_1 = __importDefault(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const multer_1 = __importDefault(require("multer"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const accounts_1 = require("../models/accounts");
const taskAccounts_1 = require("../models/taskAccounts");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const upload = multer_1.default({ dest: "static/upload/" }).single("file"); // for parsing multipart/form-data
exports.uploadExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const excelType = req.query.uploadType;
    if (fs_1.default.readdirSync(utils_1.getPath("static/upload"))[0]) {
        const file = fs_1.default.readdirSync(utils_1.getPath("static/upload"));
        fs_1.default.unlinkSync(utils_1.getPath(`static/upload/${file[0]}`));
    }
    upload(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            logger_1.default.info(err);
            return utils_1.responseClient(res, 200, 1, err);
        }
        if (excelType === "fight") {
            const totalNumber = yield taskAccounts_1.TaskAccounts.countDocuments();
            yield excel2db(req.file.filename, totalNumber, excelType);
        }
        else {
            const totalNumber = yield accounts_1.Accounts.countDocuments();
            yield excel2db(req.file.filename, totalNumber, excelType);
        }
        utils_1.responseClient(res, 200, 0, "上传成功");
    }));
});
exports.exportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const day = req.body.day || dayjs_1.default().format("YYYY-MM-DD");
    const exportType = req.body.exportType;
    if (exportType === "fight") {
        yield _export(taskAccounts_1.TaskAccounts, day, res);
    }
    else {
        yield _export(accounts_1.Accounts, day, res);
    }
});
function _export(model, day, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const a = yield model
            .find({
            $or: [{ uploadTime: day }, { getTime: day }]
        })
            .sort({ nickName: -1 });
        if (a.length === 0) {
            utils_1.responseClient(res, 200, 2, "没有该天的数据");
            return;
        }
        const nameCount = [];
        const sendAccounts = yield model.find({ hasSend: true, getTime: day }, "nickName");
        const allNickNames = sendAccounts.map(v => v.nickName);
        const nickNames = [...new Set(allNickNames)];
        nickNames.forEach(name => {
            const count = utils_1.countName(allNickNames, name);
            nameCount.push({ name, count });
        });
        const doc = [];
        if (a !== []) {
            for (const key in a) {
                if (a.hasOwnProperty(key)) {
                    doc.push({
                        accounts: a[key].data,
                        nickName: a[key].nickName,
                        index: Number(key) + 1
                    });
                }
            }
        }
        else {
            utils_1.responseClient(res, 200, 2, "没有该天的数据");
            return;
        }
        const exlBuf = fs_1.default.readFileSync(utils_1.getPath("static/model.xlsx"));
        const stat = {};
        stat.date = day;
        stat.accountsNumber = yield model.countDocuments({ uploadTime: day });
        stat.sendCount = yield model.countDocuments({
            hasSend: true,
            uploadTime: day
        });
        stat.leaveCount = yield model.countDocuments({
            hasSend: false,
            uploadTime: day
        });
        stat.nameCount = nameCount;
        handleExcel(exlBuf, stat, doc, res);
    });
}
function handleExcel(exlBuf, stat, doc, res) {
    // 这个data是模板上的标题，也就是你表格上面的标题
    let data;
    data = [
        [
            {
                accountsNumber: stat.accountsNumber,
                date: stat.date,
                leaveCount: stat.leaveCount,
                nameCount: stat.nameCount,
                sendCount: stat.sendCount
            }
        ],
        [doc]
    ];
    // excelName是下载Excel的文件标题
    const excelName = data[0][0].date;
    logger_1.default.info(`开始导出 ${excelName}.xlsx`);
    ejsexcel_1.default.renderExcelCb(exlBuf, data, (err, exlBuf2) => {
        if (err) {
            logger_1.default.error(err);
            return;
        }
        fs_1.default.writeFileSync(utils_1.getPath(`static/excel/${excelName}.xlsx`), exlBuf2);
        res.setHeader("Content-disposition", "attachment; filename=" + encodeURIComponent(excelName) + ".xlsx");
        res.setHeader("Content-type", "charset=utf-8");
        const filestream = fs_1.default.createReadStream(utils_1.getPath(`static/excel/${excelName}.xlsx`));
        filestream.on("data", chunk => {
            res.write(chunk);
        });
        filestream.on("end", () => {
            fs_1.default.unlinkSync(utils_1.getPath(`static/excel/${excelName}.xlsx`));
            logger_1.default.info(`导出成功 ${excelName}.xlsx`);
            res.end();
        });
    });
}
function excel2db(file, totalNumber, excelType) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = node_xlsx_1.default.parse(utils_1.getPath(`static/upload/${file}`));
        const fileData = lodash_1.default.flatten(obj[0].data);
        if (excelType === "fight") {
            for (let i = 1; i < fileData.length; i++) {
                try {
                    const account = new taskAccounts_1.TaskAccounts({
                        data: fileData[i],
                        hasSend: false,
                        nickName: undefined,
                        id: i + totalNumber,
                        uploadTime: dayjs_1.default().format("YYYY-MM-DD"),
                        getTime: undefined
                    });
                    yield account.save();
                }
                catch (error) {
                    logger_1.default.error(`${excelType} ${error}`);
                    break;
                }
            }
        }
        else {
            for (let i = 1; i < fileData.length; i++) {
                try {
                    const taskAccount = new accounts_1.Accounts({
                        data: fileData[i],
                        hasSend: false,
                        nickName: undefined,
                        id: i + totalNumber,
                        uploadTime: dayjs_1.default().format("YYYY-MM-DD"),
                        getTime: undefined
                    });
                    yield taskAccount.save();
                }
                catch (error) {
                    logger_1.default.error(`${excelType} ${error}`);
                    break;
                }
            }
        }
        logger_1.default.info(`${file} 上传成功`);
    });
}
//# sourceMappingURL=excel.js.map