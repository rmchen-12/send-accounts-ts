import { Document, Model, model, Schema } from 'mongoose';

export interface TaskAccountsModal extends Document {
  data: string; // 账号----密码
  hasSend: boolean; // 是不是已经发放
  nickName: string; // 领取的用户昵称
  id: number; // tag
  uploadTime: string; // 上传时间
  getTime: string; // 领取时间
}

export const TaskAccountsSchema: Schema = new Schema({
  data: String, // 账号----密码
  hasSend: Boolean, // 是不是已经发放
  nickName: String, // 领取的用户昵称
  id: Number, // tag
  uploadTime: String, // 上传时间
  getTime: String // 领取时间
});

export const TaskAccounts: Model<TaskAccountsModal> = model<TaskAccountsModal>(
  "TaskAccounts",
  TaskAccountsSchema
);
