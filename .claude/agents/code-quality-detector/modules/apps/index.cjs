"use strict";
/**
 * Apps 目录检测模块导出
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteArchitectureModule = exports.appsContentModule = exports.appsNamingModule = void 0;
var naming_app_1 = require("./naming-app");
Object.defineProperty(exports, "appsNamingModule", { enumerable: true, get: function () { return naming_app_1.appsNamingModule; } });
var content_app_1 = require("./content-app");
Object.defineProperty(exports, "appsContentModule", { enumerable: true, get: function () { return content_app_1.appsContentModule; } });
var architecture_website_1 = require("./architecture-website");
Object.defineProperty(exports, "websiteArchitectureModule", { enumerable: true, get: function () { return architecture_website_1.websiteArchitectureModule; } });
// 导入时自动注册所有模块
require("./naming-app");
require("./content-app");
require("./architecture-website");
