import { Document, Model, model, Schema } from "mongoose";

export interface PasswordModal extends Document {
  password: string; // 口令
}

const PasswordSchema: Schema = new Schema({
  password: String // 口令
});

export const Password: Model<PasswordModal> = model<PasswordModal>(
  "Password",
  PasswordSchema
);
