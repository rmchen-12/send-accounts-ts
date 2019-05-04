import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import { Accounts } from '../models/accounts';
import { Password } from '../models/password';
import { countName, responseClient } from '../utils';
import logger from '../utils/logger';

export const getData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { nickName, amount, password } = req.body;
  try {
    if (!amount) {
      return;
    }
    let passwords;
    passwords = await Password.find();
    if (passwords.length === 0) {
      await Password.create({ password: "" });
    }
    passwords = await Password.find();

    // 校验密码
    if (password && Number(passwords[0].password) !== Number(password)) {
      responseClient(res, 200, 1, "口令有误哦");
      return;
    }

    if (Number(amount) === 0) {
      responseClient(res, 200, 1, "不能选择0个哦");
      return;
    }

    // 更新amount条数据并返回
    const noSendAccount = await Accounts.find({ hasSend: false })
      .sort({
        id: 1
      })
      .limit(amount);

    noSendAccount.forEach(async doc => {
      await Accounts.updateOne(
        {
          _id: doc._id
        },
        {
          $set: {
            getTime: moment().format("YYYY-MM-DD"),
            hasSend: true,
            nickName
          }
        }
      );
    });

    logger.info(`user:${nickName}  number:${amount} password:${password}`);
    responseClient(res, 200, 0, "更新成功", noSendAccount);
  } catch (error) {
    responseClient(res);
    if (error) {
      return next(error);
    }
  }
};

export const getStat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stat = {} as app.stat;
  stat.countDTO = [];
  try {
    const totalNumber = await Accounts.countDocuments({});
    const todayTotalNumber = await Accounts.countDocuments({
      uploadTime: moment().format("YYYY-MM-DD")
    });
    const todaySendNumber = await Accounts.countDocuments({
      hasSend: true,
      getTime: moment().format("YYYY-MM-DD")
    });
    const leaveAccountNumber = await Accounts.countDocuments({
      hasSend: false
    });
    const passwords = await Password.find({});

    stat.hasPassword = passwords[0].password ? true : false;
    stat.todayTotalNumber = todayTotalNumber;
    stat.todaySendNumber = todaySendNumber;
    stat.totalNumber = totalNumber;
    stat.leaveAccountNumber = leaveAccountNumber;

    const aAccounts = await Accounts.find(
      { hasSend: true, getTime: moment().format("YYYY-MM-DD") },
      "nickName"
    );
    const allNickNames = aAccounts.map(v => v.nickName);
    const nickNames = [...new Set(allNickNames)];
    nickNames.forEach(name => {
      const count = countName(allNickNames, name);
      stat.countDTO.push({ name, count });
    });
    responseClient(res, 200, 0, "统计成功", stat);
  } catch (error) {
    responseClient(res);
    if (error) {
      return next(error);
    }
  }
};
