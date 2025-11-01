/**
 * Xorigo UI 组件迁移器
 *
 * 专门用于将归档组件迁移到新架构的智能工具
 * 基于 v1.4 架构规范和 component-taxonomy-v1.4.yaml 分类标准
 */

const fs = require('fs');
const path = require('path');

class XorigoComponentMigrator {
  constructor(workspacePath) {
    this.workspacePath = workspacePath;
    this.archivedPath = path.join(workspacePath, 'packages/core/src-archived-20251022-023941');
    this.componentsPath = path.join(workspacePath, 'packages/core/src');

    // 基于棕地架构 v1.5.1 的分类映射
    this.categoryMapping = {
      'inputs': 'form',          // inputs 归属于 form 分类
      'form': 'form',            // 表单组件 (单数命名)
      'overlays': 'overlays',
      'feedback': 'feedback',
      'layout': 'layout',
      'navigation': 'navigation',
      'datadisplay': 'data-display',
      'charts': 'data-display',  // charts 归属于 data-display
      'ui': 'primitives',
      'effects': 'effects',
      'interactive': 'showcase', // interactive 归属于 showcase
      'loading': 'feedback',     // loading 归属于 feedback
      'showcase': 'showcase',
      'motion': 'motion'         // motion 组件独立分类
    };

    // 重命名规则 (PascalCase -> kebab-case)
    this.renameRules = {
      'Input.tsx': 'input.tsx',
      'Button.tsx': 'button.tsx',
      'Modal.tsx': 'modal.tsx',
      'Form.tsx': 'form.tsx',
      'Table.tsx': 'table.tsx',
      'Card.tsx': 'card.tsx',
      'Grid.tsx': 'grid.tsx',
      'Flex.tsx': 'flex.tsx',
      'Container.tsx': 'container.tsx',
      'Alert.tsx': 'alert.tsx',
      'Toast.tsx': 'toast.tsx',
      'Dialog.tsx': 'dialog.tsx',
      'Drawer.tsx': 'drawer.tsx',
      'Sheet.tsx': 'sheet.tsx',
      'Select.tsx': 'select.tsx',
      'Switch.tsx': 'switch.tsx',
      'Checkbox.tsx': 'checkbox.tsx',
      'Radio.tsx': 'radio.tsx',
      'Slider.tsx': 'slider.tsx',
      'Textarea.tsx': 'textarea.tsx',
      'ButtonGroup.tsx': 'button-group.tsx',
      'InputNumber.tsx': 'input-number.tsx',
      'SearchInput.tsx': 'search-input.tsx',
      'PasswordInput.tsx': 'password-input.tsx',
      'Combobox.tsx': 'combobox.tsx',
      'Command.tsx': 'command.tsx',
      'Fieldset.tsx': 'fieldset.tsx',
      'FormField.tsx': 'form-field.tsx',
      'ValidationMessage.tsx': 'validation-message.tsx',
      'InputGroup.tsx': 'input-group.tsx',
      'Popover.tsx': 'popover.tsx',
      'HoverCard.tsx': 'hover-card.tsx',
      'Lightbox.tsx': 'lightbox.tsx',
      'OverlayTrigger.tsx': 'overlay-trigger.tsx',
      'Notification.tsx': 'notification.tsx',
      'Progress.tsx': 'progress.tsx',
      'Loading.tsx': 'loading.tsx',
      'ThemeToggle.tsx': 'theme-toggle.tsx'
    };
  }

  /**
   * 分析归档组件结构
   */
  analyzeArchivedComponents() {
    const analysis = {
      totalComponents: 0,
      categories: {},
      migrationPlan: []
    };

    if (!fs.existsSync(this.archivedPath)) {
      throw new Error(`归档路径不存在: ${this.archivedPath}`);
    }

    const categories = fs.readdirSync(this.archivedPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    categories.forEach(category => {
      const categoryPath = path.join(this.archivedPath, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.'))
        .sort();

      if (files.length > 0) {
        const targetCategory = this.categoryMapping[category] || category;

        analysis.categories[category] = {
          sourceCount: files.length,
          files: files,
          targetCategory: targetCategory,
          priority: this.getCategoryPriority(category)
        };

        analysis.totalComponents += files.length;

        // 生成迁移计划
        files.forEach(file => {
          const newFileName = this.renameRules[file] || this.kebabCase(file.replace('.tsx', '')) + '.tsx';
          analysis.migrationPlan.push({
            sourcePath: path.join(categoryPath, file),
            targetPath: path.join(this.componentsPath, targetCategory, newFileName),
            sourceCategory: category,
            targetCategory: targetCategory,
            originalName: file,
            newName: newFileName,
            priority: analysis.categories[category].priority
          });
        });
      }
    });

    // 按优先级排序迁移计划
    analysis.migrationPlan.sort((a, b) => a.priority - b.priority);

    return analysis;
  }

  /**
   * 获取分类优先级
   */
  getCategoryPriority(category) {
    const priorities = {
      'inputs': 1,
      'form': 2,
      'overlays': 3,
      'feedback': 4,
      'layout': 5,
      'navigation': 6,
      'datadisplay': 7,
      'charts': 8,
      'ui': 9,
      'effects': 10,
      'interactive': 11,
      'loading': 12,
      'showcase': 13
    };
    return priorities[category] || 99;
  }

  /**
   * PascalCase 转 kebab-case
   */
  kebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * 创建目标目录结构
   */
  createTargetDirectories() {
    const categories = Object.values(this.categoryMapping);
    categories.forEach(category => {
      const targetDir = path.join(this.componentsPath, category);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`✅ 创建目录: ${targetDir}`);
      }
    });
  }

  /**
   * 迁移单个组件
   */
  migrateComponent(planItem) {
    const { sourcePath, targetPath, sourceCategory, targetCategory, originalName, newName } = planItem;

    try {
      // 确保目标目录存在
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 检查源文件是否存在
      if (!fs.existsSync(sourcePath)) {
        console.warn(`⚠️  源文件不存在: ${sourcePath}`);
        return false;
      }

      // 读取源文件内容
      const sourceContent = fs.readFileSync(sourcePath, 'utf8');

      // 修复导入路径 (如果需要)
      const fixedContent = this.fixImportPaths(sourceContent, sourceCategory, targetCategory);

      // 写入目标文件
      fs.writeFileSync(targetPath, fixedContent, 'utf8');

      console.log(`✅ 迁移成功: ${sourceCategory}/${originalName} → ${targetCategory}/${newName}`);
      return true;

    } catch (error) {
      console.error(`❌ 迁移失败: ${originalName}`, error.message);
      return false;
    }
  }

  /**
   * 修复导入路径
   */
  fixImportPaths(content, sourceCategory, targetCategory) {
    // 修复相对导入路径
    const importPathRegex = /from\s+['"](\.\.\/\.\.\/[^'"]+)['"]/g;

    return content.replace(importPathRegex, (match, importPath) => {
      // 如果导入路径指向归档目录，需要更新
      if (importPath.includes('src-archived-20251022-023941')) {
        // 将归档路径替换为新的组件路径
        const newPath = importPath
          .replace(/.*src-archived-20251022-023941\/([^\/]+).*/, '../$1')
          .replace(/ui/g, 'primitives')  // ui -> primitives
          .replace(/form/g, 'forms');    // form -> forms (单数复数)

        return `from '${newPath}'`;
      }

      return match;
    });
  }

  /**
   * 生成分类导出文件
   */
  generateCategoryExports(category, components) {
    const targetCategory = this.categoryMapping[category] || category;
    const exportPath = path.join(this.componentsPath, targetCategory, 'index.ts');

    let exportContent = `/**
 * ${this.capitalizeFirst(targetCategory)} Components - ${this.getCategoryDescription(targetCategory)}
 *
 * ${this.getCategoryDetails(targetCategory)}
 */
`;

    // 按类型分组组件
    const groupedComponents = this.groupComponentsByType(components);

    Object.entries(groupedComponents).forEach(([type, typeComponents]) => {
      exportContent += `\n// ${type}\n`;

      typeComponents.forEach(comp => {
        const componentName = path.basename(comp.newName, '.tsx');
        const PascalCaseName = this.kebabCaseToPascalCase(componentName);
        exportContent += `export { ${PascalCaseName} } from './${componentName}'\n`;
        exportContent += `export type { ${PascalCaseName}Props } from './${componentName}'\n`;
      });
    });

    fs.writeFileSync(exportPath, exportContent, 'utf8');
    console.log(`✅ 生成导出文件: ${exportPath}`);
  }

  /**
   * 按类型分组组件
   */
  groupComponentsByType(components) {
    const groups = {
      '基础组件': [],
      '组合组件': [],
      '专用组件': []
    };

    components.forEach(comp => {
      const name = comp.newName.replace('.tsx', '');
      if (name.includes('-group') || name.includes('input-group') || name.includes('field')) {
        groups['组合组件'].push(comp);
      } else if (name.includes('search') || name.includes('password') || name.includes('number')) {
        groups['专用组件'].push(comp);
      } else {
        groups['基础组件'].push(comp);
      }
    });

    return groups;
  }

  /**
   * 获取分类描述
   */
  getCategoryDescription(category) {
    const descriptions = {
      'inputs': '输入组件集合',
      'forms': '表单组件集合',
      'overlays': '覆盖层组件集合',
      'feedback': '反馈组件集合',
      'layout': '布局组件集合',
      'navigation': '导航组件集合',
      'data-display': '数据显示组件集合',
      'charts': '图表组件集合',
      'primitives': 'UI基元组件集合',
      'effects': '特效组件集合',
      'interactive': '交互组件集合',
      'loading': '加载组件集合',
      'showcase': '展示组件集合'
    };
    return descriptions[category] || '组件集合';
  }

  /**
   * 获取分类详细信息
   */
  getCategoryDetails(category) {
    const details = {
      'inputs': '提供各种用户输入控件，支持文本、数字、选择等输入类型',
      'forms': '提供表单容器和管理组件，支持表单验证、布局和状态管理',
      'overlays': '提供各种覆盖层和弹窗组件，支持Portal渲染、焦点管理和无障碍访问',
      'feedback': '提供用户操作反馈和状态提示组件，包括警告、提示、加载等',
      'layout': '提供布局和容器组件，支持响应式设计和灵活的布局系统',
      'navigation': '提供导航和路由组件，支持菜单、面包屑、标签页等导航模式',
      'data-display': '提供数据展示组件，包括表格、列表、卡片等数据可视化组件',
      'charts': '提供图表组件，支持各种数据可视化需求',
      'primitives': '提供基础UI元素，构成更复杂组件的基础',
      'effects': '提供视觉特效组件，增强用户体验',
      'interactive': '提供交互组件，支持复杂的用户交互模式',
      'loading': '提供加载状态组件，提升用户体验',
      'showcase': '提供展示组件，用于产品展示和演示'
    };
    return details[category] || '提供相关功能组件';
  }

  /**
   * kebab-case 转 PascalCase
   */
  kebabCaseToPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * 首字母大写
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 执行完整迁移流程
   */
  async migrate(options = {}) {
    const {
      phases = ['inputs', 'form', 'overlays', 'feedback'], // 默认只迁移前4个阶段
      dryRun = false,
      skipExisting = false
    } = options;

    console.log('🚀 开始 Xorigo UI 组件迁移...\n');

    try {
      // 1. 分析归档组件
      console.log('📊 分析归档组件结构...');
      const analysis = this.analyzeArchivedComponents();
      console.log(`📈 发现 ${analysis.totalComponents} 个组件，分布在 ${Object.keys(analysis.categories).length} 个分类中\n`);

      // 显示分类统计
      Object.entries(analysis.categories).forEach(([category, info]) => {
        console.log(`  📁 ${category}: ${info.sourceCount} 个组件 → ${info.targetCategory}/ (优先级: ${info.priority})`);
      });

      // 2. 创建目标目录
      if (!dryRun) {
        console.log('\n📁 创建目标目录结构...');
        this.createTargetDirectories();
      }

      // 3. 按阶段迁移组件
      const migrationPhases = this.groupMigrationByPhase(analysis.migrationPlan, phases);

      let totalMigrated = 0;
      let totalFailed = 0;

      for (const [phaseName, phaseComponents] of Object.entries(migrationPhases)) {
        console.log(`\n🎯 Phase ${phaseName}: 迁移 ${phaseComponents.length} 个组件`);

        if (dryRun) {
          console.log('  (预演模式，只显示计划)');
          phaseComponents.forEach(comp => {
            console.log(`    • ${comp.sourceCategory}/${comp.originalName} → ${comp.targetCategory}/${comp.newName}`);
          });
          continue;
        }

        // 迁移组件
        const categoryGroups = this.groupByTargetCategory(phaseComponents);

        for (const [targetCategory, components] of Object.entries(categoryGroups)) {
          console.log(`  📂 迁移到 ${targetCategory}/:`);

          let categoryMigrated = 0;
          let categoryFailed = 0;

          for (const comp of components) {
            if (this.migrateComponent(comp)) {
              categoryMigrated++;
              totalMigrated++;
            } else {
              categoryFailed++;
              totalFailed++;
            }
          }

          console.log(`    ✅ 成功: ${categoryMigrated}, ❌ 失败: ${categoryFailed}`);

          // 生成分类导出文件
          if (categoryMigrated > 0) {
            const originalCategory = this.findOriginalCategory(targetCategory, analysis.categories);
            this.generateCategoryExports(originalCategory, components);
          }
        }
      }

      // 4. 生成主导出文件
      if (!dryRun && totalMigrated > 0) {
        console.log('\n📦 生成主导出文件...');
        this.generateMainExports(migrationPhases);
      }

      // 5. 输出迁移总结
      console.log('\n📋 迁移总结:');
      console.log(`  ✅ 成功迁移: ${totalMigrated} 个组件`);
      console.log(`  ❌ 迁移失败: ${totalFailed} 个组件`);
      console.log(`  📊 成功率: ${((totalMigrated / (totalMigrated + totalFailed)) * 100).toFixed(1)}%`);

      if (dryRun) {
        console.log('\n💡 这是预演模式，实际迁移请设置 dryRun: false');
      }

      return {
        success: true,
        totalMigrated,
        totalFailed,
        analysis
      };

    } catch (error) {
      console.error('❌ 迁移过程中发生错误:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 按迁移阶段分组
   */
  groupMigrationByPhase(migrationPlan, phases) {
    const phases = {
      '1 (核心基础)': migrationPlan.filter(item => ['inputs', 'form'].includes(item.sourceCategory)),
      '2 (覆盖层反馈)': migrationPlan.filter(item => ['overlays', 'feedback'].includes(item.sourceCategory)),
      '3 (布局导航)': migrationPlan.filter(item => ['layout', 'navigation'].includes(item.sourceCategory)),
      '4 (数据图表)': migrationPlan.filter(item => ['datadisplay', 'charts'].includes(item.sourceCategory)),
      '5 (其他组件)': migrationPlan.filter(item => !['inputs', 'form', 'overlays', 'feedback', 'layout', 'navigation', 'datadisplay', 'charts'].includes(item.sourceCategory))
    };

    return phases;
  }

  /**
   * 按目标分类分组
   */
  groupByTargetCategory(components) {
    const groups = {};
    components.forEach(comp => {
      if (!groups[comp.targetCategory]) {
        groups[comp.targetCategory] = [];
      }
      groups[comp.targetCategory].push(comp);
    });
    return groups;
  }

  /**
   * 查找原始分类名称
   */
  findOriginalCategory(targetCategory, categories) {
    for (const [original, info] of Object.entries(categories)) {
      if (info.targetCategory === targetCategory) {
        return original;
      }
    }
    return targetCategory;
  }

  /**
   * 生成主导出文件
   */
  generateMainExports(migrationPhases) {
    const exportPath = path.join(this.componentsPath, 'index.ts');

    let exportContent = `/**
 * Xorigo UI Components - 组件库统一导出
 *
 * 基于七轴主题系统的现代化React组件库
 * 支持多种主题配方和完整的设计令牌系统
 */

`;

    const categoryOrder = ['inputs', 'forms', 'overlays', 'feedback', 'layout', 'navigation', 'data-display', 'charts', 'primitives', 'effects', 'interactive', 'loading', 'showcase', 'shared'];

    categoryOrder.forEach(category => {
      exportContent += `// ============================================================================\n`;
      exportContent += `// ${this.capitalizeFirst(category)} - ${this.getCategoryDescription(category)}\n`;
      exportContent += `// ============================================================================\n\n`;

      const hasComponents = Object.values(migrationPhases).some(phase =>
        phase.some(comp => comp.targetCategory === category)
      );

      if (hasComponents) {
        exportContent += `export * from './${category}'\n\n`;
      } else {
        exportContent += `// export * from './${category}' // 即将迁移\n\n`;
      }
    });

    fs.writeFileSync(exportPath, exportContent, 'utf8');
    console.log(`✅ 生成主导出文件: ${exportPath}`);
  }
}

module.exports = XorigoComponentMigrator;