import ejsExcel from 'ejsexcel';
import { Request, Response } from 'express';
import fs from 'fs';
import moment from 'moment';
import multer from 'multer';
import xlsx from 'node-xlsx';

import { Accounts } from '../models/accounts';
import { countName, getPath, responseClient } from '../utils';
import logger from '../utils/logger';

const upload = multer({ dest: "static/upload/" }).single("file"); // for parsing multipart/form-data

export const uploadExcel = async (req: Request, res: Response) => {
  if (fs.readdirSync(getPath("static/upload"))[0]) {
    const file = fs.readdirSync(getPath("static/upload"));
    fs.unlinkSync(getPath(`static/upload/${file[0]}`));
  }

  upload(req, res, async err => {
    if (err) {
      logger.info(err);
      return responseClient(res, 200, 1, err);
    }
    const totalNumber = await Accounts.find({}).sort({ id: -1 });
    excel2db(req.file.filename, totalNumber[0].id);
    responseClient(res, 200, 0, "上传成功");
  });
};

export const exportExcel = async (req: Request, res: Response) => {
  const day: string = req.body.day || moment().format("YYYY-MM-DD");

  const a = await Accounts.find({
    $or: [{ uploadTime: day }, { getTime: day }]
  }).sort({ nickName: -1 });

  if (a.length === 0) {
    responseClient(res, 200, 2, "没有该天的数据");
    return;
  }

  const nameCount: object[] = [];
  const sendAccounts = await Accounts.find(
    { hasSend: true, getTime: day },
    "nickName"
  );
  const allNickNames = sendAccounts.map(v => v.nickName);
  const nickNames = [...new Set(allNickNames)];
  nickNames.forEach(name => {
    const count = countName(allNickNames, name);
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
  } else {
    responseClient(res, 200, 2, "没有该天的数据");
    return;
  }
  const exlBuf = fs.readFileSync(getPath("static/model.xlsx"));
  const stat = {} as app.ExcelStat;
  stat.date = day;
  stat.accountsNumber = await Accounts.countDocuments({ uploadTime: day });
  stat.sendCount = await Accounts.countDocuments({
    hasSend: true,
    uploadTime: day
  });
  stat.leaveCount = await Accounts.countDocuments({
    hasSend: false,
    uploadTime: day
  });
  stat.nameCount = nameCount;

  handleExcel(exlBuf, stat, doc, res);
};

function excel2db(file: string, totalNumber: number) {
  const obj = xlsx.parse(getPath(`static/upload/${file}`));
  const fileData = obj[0].data;
  for (let i = 1; i < fileData.length; i++) {
    Accounts.create({
      data: fileData[i],
      hasSend: false,
      nickName: undefined,
      id: i + totalNumber,
      uploadTime: moment().format("YYYY-MM-DD"),
      getTime: undefined
    });
    // const account = new Accounts({});
    // account.save();
  }
  logger.info(`${file} 上传成功`);
}

function handleExcel(
  exlBuf: Buffer,
  stat: app.ExcelStat,
  doc: object[],
  res: Response
) {
  // 这个data是模板上的标题，也就是你表格上面的标题
  let data: any;
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
  logger.info(`开始导出 ${excelName}.xlsx`);
  ejsExcel.renderExcelCb(exlBuf, data, (err: any, exlBuf2: any) => {
    if (err) {
      logger.error(err);
      return;
    }

    fs.writeFileSync(getPath(`static/excel/${excelName}.xlsx`), exlBuf2);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=" + encodeURIComponent(excelName) + ".xlsx"
    );
    res.setHeader("Content-type", "charset=utf-8");
    const filestream = fs.createReadStream(
      getPath(`static/excel/${excelName}.xlsx`)
    );
    filestream.on("data", chunk => {
      res.write(chunk);
    });
    filestream.on("end", () => {
      fs.unlinkSync(getPath(`static/excel/${excelName}.xlsx`));
      logger.info(`导出成功 ${excelName}.xlsx`);
      res.end();
    });
  });
}
