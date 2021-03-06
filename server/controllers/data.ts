import AsyncLock from 'async-lock';
import moment from 'dayjs';
import { NextFunction, Request, Response } from 'express';

import { Accounts as TaskAccounts } from '../models/accounts';
import { Password } from '../models/password';
import { TaskAccounts as Accounts } from '../models/taskAccounts';
import { countName, responseClient } from '../utils';
import logger from '../utils/logger';

const lock = new AsyncLock();
export const getData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { nickName, amount, password, type } = req.body;
  try {
    if (!amount) {
      return;
    }
    const passwords = await Password.find();

    // 校验密码
    if (type === "fight") {
      if (
        password &&
        Number(passwords[0].password) !==
          Number(password.slice(0, password.length - 1))
      ) {
        responseClient(res, 200, 1, "口令有误哦");
        return;
      }
    } else {
      if (password && Number(passwords[0].password) !== Number(password)) {
        responseClient(res, 200, 1, "口令有误哦");
        return;
      }
    }

    if (Number(amount) === 0) {
      responseClient(res, 200, 1, "不能选择0个哦");
      return;
    }

    // 更新amount条数据并返回
    lock
      .acquire("updateAccounts", async () => {
        const noSendAccount =
          type === "fight"
            ? await _update(Accounts, amount, nickName)
            : await _update(TaskAccounts, amount, nickName);

        logger.info(`user:${nickName}  number:${amount} password:${password}`);
        return noSendAccount;
      })
      .then(noSendAccount => {
        responseClient(res, 200, 0, "更新成功", noSendAccount);
      })
      .catch(err => {
        logger.error(err.message);
      });
  } catch (error) {
    responseClient(res);
    if (error) {
      return next(error);
    }
  }
};

async function _update(
  model: typeof Accounts | typeof TaskAccounts,
  amount: number,
  nickName: string
) {
  // 更新amount条数据并返回
  const noSendAccount = await model
    .find({ hasSend: false })
    .sort({ id: 1 })
    .limit(amount);

  noSendAccount.forEach(async (doc: any) => {
    await model.updateOne(
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

  return noSendAccount;
}

export const getStat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type }: { type: app.ExcelType } = req.body;
  const stat = {} as app.stat;
  stat.countDTO = [];
  try {
    const {
      totalNumber,
      todayTotalNumber,
      todaySendNumber,
      leaveAccountNumber,
      aAccounts
    } =
      type === "fight"
        ? await _getStat(Accounts)
        : await _getStat(TaskAccounts);

    let passwords;
    passwords = await Password.find();
    if (passwords.length === 0) {
      await Password.create({ password: "" });
    }
    passwords = await Password.find();

    stat.hasPassword = passwords[0].password ? true : false;
    stat.todayTotalNumber = todayTotalNumber;
    stat.todaySendNumber = todaySendNumber;
    stat.totalNumber = totalNumber;
    stat.leaveAccountNumber = leaveAccountNumber;

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

async function _getStat(model: typeof Accounts | typeof TaskAccounts) {
  const totalNumber = await model.countDocuments({});
  const todayTotalNumber = await model.countDocuments({
    uploadTime: moment().format("YYYY-MM-DD")
  });
  const todaySendNumber = await model.countDocuments({
    hasSend: true,
    getTime: moment().format("YYYY-MM-DD")
  });
  const leaveAccountNumber = await model.countDocuments({
    hasSend: false
  });
  const aAccounts = await model.find(
    { hasSend: true, getTime: moment().format("YYYY-MM-DD") },
    "nickName"
  );
  return {
    totalNumber,
    todayTotalNumber,
    todaySendNumber,
    leaveAccountNumber,
    aAccounts
  };
}

// 重置数据
export const resetDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type }: { type: app.ExcelType } = req.body;
  try {
    const model = type === "fight" ? Accounts : TaskAccounts;
    await model.remove({});
    responseClient(res, 200, 0, "已清空数据");
  } catch (error) {
    responseClient(res);
    if (error) {
      return next(error);
    }
  }
};
