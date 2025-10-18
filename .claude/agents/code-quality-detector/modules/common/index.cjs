"use strict";
/**
 * 通用检测模块导出
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.structureCommonModule = void 0;
var structure_common_1 = require("./structure-common");
Object.defineProperty(exports, "structureCommonModule", { enumerable: true, get: function () { return structure_common_1.structureCommonModule; } });
// 导入时自动注册所有模块
require("./structure-common");
