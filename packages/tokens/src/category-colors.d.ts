/**
 * 🎨 Xorigo-UI 组件分类颜色令牌
 *
 * 为不同组件分类提供专属的配色方案
 * 包含10个精选分类的完整配色系统
 */
/**
 * 组件分类颜色配置接口
 */
export interface ComponentCategoryColors {
    /** 主色调 - 用于按钮、链接等主要交互元素 */
    primary: string;
    /** 次要色调 - 用于次要按钮、边框等 */
    secondary: string;
    /** 强调色 - 用于高亮、徽章、状态指示 */
    accent: string;
    /** 发光效果 - 用于阴影、背景光晕 */
    glow: string;
    /** 渐变色 - 用于背景、卡片等 */
    gradient: string;
    /** 悬停渐变 - 用于鼠标悬停状态 */
    hoverGradient: string;
    /** 选中渐变 - 用于激活、选中状态 */
    selectedGradient: string;
}
/**
 * 组件分类信息接口
 */
export interface ComponentCategory {
    /** 分类ID */
    id: string;
    /** 分类名称 */
    name: string;
    /** 分类描述 */
    description: string;
    /** 包含的组件列表 */
    components: string[];
    /** 颜色配置 */
    colors: ComponentCategoryColors;
}
/**
 * UI 基础组件配色 - 优雅的靛蓝渐变
 */
export declare const uiBasicColors: ComponentCategoryColors;
/**
 * 输入控件配色 - 温暖的珊瑚渐变
 */
export declare const inputsColors: ComponentCategoryColors;
/**
 * 导航结构配色 - 清新的天蓝渐变
 */
export declare const navigationColors: ComponentCategoryColors;
/**
 * 反馈状态配色 - 自然的翠绿渐变
 */
export declare const feedbackColors: ComponentCategoryColors;
/**
 * 弹层遮罩配色 - 热情的橙红渐变
 */
export declare const overlaysColors: ComponentCategoryColors;
/**
 * 数据展示配色 - 深邃的宝蓝渐变
 */
export declare const dataDisplayColors: ComponentCategoryColors;
/**
 * 布局分区配色 - 优雅的粉紫渐变
 */
export declare const layoutColors: ComponentCategoryColors;
/**
 * 图表组件配色 - 温柔的粉橙渐变
 */
export declare const chartsColors: ComponentCategoryColors;
/**
 * 表单容器配色 - 优雅的玫瑰渐变
 */
export declare const formsColors: ComponentCategoryColors;
/**
 * 工具类配色 - 活力的琥珀渐变
 */
export declare const utilitiesColors: ComponentCategoryColors;
/**
 * 所有组件分类的完整配色方案
 */
export declare const componentCategoryColors: Record<string, ComponentCategoryColors>;
/**
 * 获取指定分类的颜色配置
 */
export declare function getCategoryColors(categoryId: string): ComponentCategoryColors | null;
/**
 * 获取所有可用的分类ID
 */
export declare function getCategoryIds(): string[];
/**
 * 检查分类是否存在
 */
export declare function hasCategoryColors(categoryId: string): boolean;
/**
 * 验证是否为有效的组件分类颜色配置
 */
export declare function isValidComponentCategoryColors(colors: any): colors is ComponentCategoryColors;
/**
 * 获取指定分类的主色调
 */
export declare function getPrimaryColor(categoryId: string): string | null;
/**
 * 获取指定分类的渐变色
 */
export declare function getGradientColor(categoryId: string): string | null;
/**
 * 获取指定分类的悬停渐变
 */
export declare function getHoverGradient(categoryId: string): string | null;
//# sourceMappingURL=category-colors.d.ts.map