"use strict";
/**
 * 🎨 TH-UI 令牌系统 - 统一导出
 *
 * 基于 DTCG 标准的设计令牌系统
 * 从 src/tokens/ 目录动态加载令牌数据
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardAliases = exports.buttonAliases = exports.compact = exports.spacious = exports.comfortable = exports.corporateBlue = exports.spacing = exports.typography = exports.stateColors = exports.purpleScale = exports.cyanScale = exports.blueScale = exports.neutralScale = void 0;
exports.getCoreTokens = getCoreTokens;
exports.getAllRecipeMeta = getAllRecipeMeta;
exports.getAllDensityPresets = getAllDensityPresets;
// ============================================================================
// 兼容性导出 - 旧版颜色令牌 (Legacy Color Tokens Export)
// ============================================================================
__exportStar(require("./colors"), exports);
// ============================================================================
// 核心令牌导出 (Core Tokens Export)
// ============================================================================
const neutralScale_json_1 = __importDefault(require("./core/palettes/neutralScale.json"));
exports.neutralScale = neutralScale_json_1.default;
const blueScale_json_1 = __importDefault(require("./core/palettes/blueScale.json"));
exports.blueScale = blueScale_json_1.default;
const cyanScale_json_1 = __importDefault(require("./core/palettes/cyanScale.json"));
exports.cyanScale = cyanScale_json_1.default;
const purpleScale_json_1 = __importDefault(require("./core/palettes/purpleScale.json"));
exports.purpleScale = purpleScale_json_1.default;
const stateColors_json_1 = __importDefault(require("./core/palettes/stateColors.json"));
exports.stateColors = stateColors_json_1.default;
const typography_json_1 = __importDefault(require("./core/foundations/typography.json"));
exports.typography = typography_json_1.default;
const spacing_json_1 = __importDefault(require("./core/foundations/spacing.json"));
exports.spacing = spacing_json_1.default;
// ============================================================================
// 配方导出 (Recipes Export)
// ============================================================================
const meta_json_1 = __importDefault(require("./recipes/corporate-blue/meta.json"));
exports.corporateBlue = meta_json_1.default;
// ============================================================================
// 密度预设导出 (Density Presets Export)
// ============================================================================
const comfortable_json_1 = __importDefault(require("./density-presets/comfortable.json"));
exports.comfortable = comfortable_json_1.default;
const spacious_json_1 = __importDefault(require("./density-presets/spacious.json"));
exports.spacious = spacious_json_1.default;
const compact_json_1 = __importDefault(require("./density-presets/compact.json"));
exports.compact = compact_json_1.default;
// ============================================================================
// 组件别名导出 (Component Aliases Export)
// ============================================================================
var button_json_1 = require("./aliases/components/button.json");
Object.defineProperty(exports, "buttonAliases", { enumerable: true, get: function () { return __importDefault(button_json_1).default; } });
var card_json_1 = require("./aliases/components/card.json");
Object.defineProperty(exports, "cardAliases", { enumerable: true, get: function () { return __importDefault(card_json_1).default; } });
// ============================================================================
// 工具函数 (Utility Functions)
// ============================================================================
/**
 * 获取所有核心令牌
 */
function getCoreTokens() {
    return {
        palettes: {
            neutralScale: neutralScale_json_1.default,
            blueScale: blueScale_json_1.default,
            cyanScale: cyanScale_json_1.default,
            purpleScale: purpleScale_json_1.default,
            stateColors: stateColors_json_1.default
        },
        foundations: {
            typography: typography_json_1.default,
            spacing: spacing_json_1.default
        }
    };
}
/**
 * 获取所有配方元数据
 */
function getAllRecipeMeta() {
    return {
        'corporate-blue': meta_json_1.default
    };
}
/**
 * 获取所有密度预设
 */
function getAllDensityPresets() {
    return {
        comfortable: comfortable_json_1.default,
        spacious: spacious_json_1.default,
        compact: compact_json_1.default
    };
}
