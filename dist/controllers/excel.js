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
const ejsexcel_1 = __importDefault(require("ejsexcel"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const multer_1 = __importDefault(require("multer"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const accounts_1 = require("../models/accounts");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const upload = multer_1.default({ dest: "static/upload/" }).single("file"); // for parsing multipart/form-data
exports.uploadExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (fs_1.default.readdirSync(utils_1.getPath("static/upload"))[0]) {
        const file = fs_1.default.readdirSync(utils_1.getPath("static/upload"));
        fs_1.default.unlinkSync(utils_1.getPath(`static/upload/${file[0]}`));
    }
    upload(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            logger_1.default.info(err);
            return utils_1.responseClient(res, 200, 1, err);
        }
        const totalNumber = yield accounts_1.Accounts.find({}).sort({ id: -1 });
        excel2db(req.file.filename, totalNumber[0].id);
        utils_1.responseClient(res, 200, 0, "上传成功");
    }));
});
exports.exportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const day = req.body.day || moment_1.default().format("YYYY-MM-DD");
    const a = yield accounts_1.Accounts.find({
        $or: [{ uploadTime: day }, { getTime: day }]
    }).sort({ nickName: -1 });
    if (a.length === 0) {
        utils_1.responseClient(res, 200, 2, "没有该天的数据");
        return;
    }
    const nameCount = [];
    const sendAccounts = yield accounts_1.Accounts.find({ hasSend: true, getTime: day }, "nickName");
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
    stat.accountsNumber = yield accounts_1.Accounts.countDocuments({ uploadTime: day });
    stat.sendCount = yield accounts_1.Accounts.countDocuments({
        hasSend: true,
        uploadTime: day
    });
    stat.leaveCount = yield accounts_1.Accounts.countDocuments({
        hasSend: false,
        uploadTime: day
    });
    stat.nameCount = nameCount;
    handleExcel(exlBuf, stat, doc, res);
});
function excel2db(file, totalNumber) {
    const obj = node_xlsx_1.default.parse(utils_1.getPath(`static/upload/${file}`));
    const fileData = obj[0].data;
    for (let i = 1; i < fileData.length; i++) {
        accounts_1.Accounts.create({
            data: fileData[i],
            hasSend: false,
            nickName: undefined,
            id: i + totalNumber,
            uploadTime: moment_1.default().format("YYYY-MM-DD"),
            getTime: undefined
        });
        // const account = new Accounts({});
        // account.save();
    }
    logger_1.default.info(`${file} 上传成功`);
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
//# sourceMappingURL=excel.js.map