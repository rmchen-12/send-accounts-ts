"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PasswordSchema = new mongoose_1.Schema({
    password: String // 口令
});
exports.Password = mongoose_1.model("Password", PasswordSchema);
//# sourceMappingURL=password.js.map