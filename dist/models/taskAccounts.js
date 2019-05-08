"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.TaskAccountsSchema = new mongoose_1.Schema({
    data: String,
    hasSend: Boolean,
    nickName: String,
    id: Number,
    uploadTime: String,
    getTime: String // 领取时间
});
exports.TaskAccounts = mongoose_1.model("TaskAccounts", exports.TaskAccountsSchema);
//# sourceMappingURL=taskAccounts.js.map