"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = require("formidable");
const fs_1 = require("fs");
const utils_1 = require("../utils");
exports.handleImage = (req, res) => {
    res.sendFile(utils_1.getPath(req.url));
};
exports.uploadImage = (req, res) => {
    const image = fs_1.default.readdirSync(utils_1.getPath("static/image"));
    if (image[0]) {
        fs_1.default.unlinkSync(utils_1.getPath(`static/image/${image[0]}`));
    }
    const form = new formidable_1.default.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = utils_1.getPath("static/image");
    form.keepExtensions = true; // 保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req);
    utils_1.responseClient(res, 200, 0, "success", fs_1.default.readdirSync(utils_1.getPath("static/image")));
};
exports.getBanner = (req, res) => {
    const img = fs_1.default.readdirSync(utils_1.getPath("static/image"));
    utils_1.responseClient(res, 200, 0, "success", `static/image/${img}`);
};
//# sourceMappingURL=image.js.map