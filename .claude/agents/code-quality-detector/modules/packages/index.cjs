"use strict";
/**
 * Packages 目录检测模块导出
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.classificationSystemModule = exports.packagesAPIModule = exports.packagesNamingModule = void 0;
var naming_package_1 = require("./naming-package");
Object.defineProperty(exports, "packagesNamingModule", { enumerable: true, get: function () { return naming_package_1.packagesNamingModule; } });
var api_component_1 = require("./api-component");
Object.defineProperty(exports, "packagesAPIModule", { enumerable: true, get: function () { return api_component_1.packagesAPIModule; } });
var classification_system_1 = require("./classification-system");
Object.defineProperty(exports, "classificationSystemModule", { enumerable: true, get: function () { return classification_system_1.classificationSystemModule; } });
// 导入时自动注册所有模块
require("./naming-package");
require("./api-component");
require("./classification-system");
