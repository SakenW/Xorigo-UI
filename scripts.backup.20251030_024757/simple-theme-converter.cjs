#!/usr/bin/env node

/**
 * Xorigo UI 简单主题转换工具
 * 批量替换组件中的硬编码颜色
 */

const fs = require('fs');
const path = require('path');

// 颜色映射表
const colorMappings = {
  // Primary colors (蓝色 -> primary)
  'bg-blue-500': 'bg-primary-500',
  'bg-blue-600': 'bg-primary-600',
  'bg-blue-700': 'bg-primary-700',
  'text-blue-600': 'text-primary-600',
  'text-blue-700': 'text-primary-700',
  'border-blue-500': 'border-primary-500',
  'border-blue-600': 'border-primary-600',
  'ring-blue-500': 'ring-primary-500',
  'hover:bg-blue-600': 'hover:bg-primary-600',
  'hover:bg-blue-700': 'hover:bg-primary-700',
  'focus:ring-blue-500': 'focus:ring-primary-500',
  'focus:border-blue-500': 'focus:border-primary-500',

  // Neutral colors (灰色 -> theme colors)
  'bg-gray-50': 'bg-background-primary',
  'bg-gray-100': 'bg-background-secondary',
  'bg-gray-200': 'bg-background-tertiary',
  'bg-slate-50': 'bg-background-primary',
  'bg-slate-100': 'bg-background-secondary',
  'bg-white': 'bg-background-primary',
  'bg-black': 'bg-background-inverse',

  'text-gray-600': 'text-text-secondary',
  'text-gray-700': 'text-text-secondary',
  'text-gray-800': 'text-text-primary',
  'text-gray-900': 'text-text-primary',
  'text-slate-900': 'text-text-primary',
  'text-slate-700': 'text-text-secondary',
  'text-slate-600': 'text-text-secondary',
  'text-slate-500': 'text-text-tertiary',
  'text-white': 'text-text-on-primary',
  'text-black': 'text-text-primary',

  'border-gray-200': 'border-border-base',
  'border-gray-300': 'border-border-base',
  'border-gray-400': 'border-border-subtle',
  'border-gray-500': 'border-border-subtle',
  'border-gray-600': 'border-border-emphasis',
  'border-gray-700': 'border-border-emphasis',
  'border-slate-200': 'border-border-base',
  'border-slate-300': 'border-border-base',

  // Status colors - extended mapping
  'bg-green-100': 'bg-success-100',
  'bg-green-200': 'bg-success-200',
  'bg-green-500': 'bg-success-500',
  'bg-green-600': 'bg-success-600',
  'bg-green-700': 'bg-success-700',
  'text-green-50': 'text-success-50',
  'text-green-600': 'text-success-600',
  'text-green-700': 'text-success-700',
  'text-green-800': 'text-success-800',
  'text-green-900': 'text-success-900',
  'border-green-500': 'border-success-500',
  'border-green-600': 'border-success-600',
  'ring-green-500': 'ring-success-500',
  'hover:bg-green-600': 'hover:bg-success-600',
  'hover:bg-green-700': 'hover:bg-success-700',

  'bg-red-100': 'bg-error-100',
  'bg-red-200': 'bg-error-200',
  'bg-red-500': 'bg-error-500',
  'bg-red-600': 'bg-error-600',
  'bg-red-700': 'bg-error-700',
  'text-red-50': 'text-error-50',
  'text-red-600': 'text-error-600',
  'text-red-700': 'text-error-700',
  'text-red-800': 'text-error-800',
  'text-red-900': 'text-error-900',
  'border-red-500': 'border-error-500',
  'border-red-600': 'border-error-600',
  'ring-red-500': 'ring-error-500',
  'hover:bg-red-600': 'hover:bg-error-600',
  'hover:bg-red-700': 'hover:bg-error-700',

  'bg-yellow-100': 'bg-warning-100',
  'bg-yellow-200': 'bg-warning-200',
  'bg-yellow-500': 'bg-warning-500',
  'bg-yellow-600': 'bg-warning-600',
  'bg-yellow-700': 'bg-warning-700',
  'text-yellow-50': 'text-warning-50',
  'text-yellow-600': 'text-warning-600',
  'text-yellow-700': 'text-warning-700',
  'text-yellow-800': 'text-warning-800',
  'text-yellow-900': 'text-warning-900',
  'border-yellow-500': 'border-warning-500',
  'border-yellow-600': 'border-warning-600',
  'ring-yellow-500': 'ring-warning-500',
  'hover:bg-yellow-600': 'hover:bg-warning-600',
  'hover:bg-yellow-700': 'hover:bg-warning-700',

  // Info colors (cyan/indigo)
  'bg-cyan-100': 'bg-info-100',
  'bg-cyan-500': 'bg-info-500',
  'bg-indigo-100': 'bg-info-100',
  'bg-indigo-500': 'bg-info-500',
  'text-cyan-600': 'text-info-600',
  'text-indigo-600': 'text-info-600',
  'border-cyan-500': 'border-info-500',
  'border-indigo-500': 'border-info-500',

  // Additional colors (orange, purple, pink, etc.)
  'bg-orange-100': 'bg-warning-100',
  'bg-orange-500': 'bg-warning-500',
  'bg-orange-600': 'bg-warning-600',
  'text-orange-600': 'text-warning-600',
  'text-orange-700': 'text-warning-700',
  'text-orange-800': 'text-warning-800',
  'border-orange-500': 'border-warning-500',
  'ring-orange-500': 'ring-warning-500',

  'bg-purple-100': 'bg-secondary-100',
  'bg-purple-500': 'bg-secondary-500',
  'bg-purple-600': 'bg-secondary-600',
  'text-purple-600': 'text-secondary-600',
  'text-purple-700': 'text-secondary-700',
  'text-purple-800': 'text-secondary-800',
  'border-purple-500': 'border-secondary-500',
  'ring-purple-500': 'ring-secondary-500',

  'bg-pink-100': 'bg-accent-100',
  'bg-pink-500': 'bg-accent-500',
  'bg-pink-600': 'bg-accent-600',
  'text-pink-600': 'text-accent-600',
  'text-pink-700': 'text-accent-700',
  'text-pink-800': 'text-accent-800',
  'border-pink-500': 'border-accent-500',
  'ring-pink-500': 'ring-accent-500',

  'bg-indigo-100': 'bg-info-100',
  'bg-indigo-500': 'bg-info-500',
  'bg-indigo-600': 'bg-info-600',
  'text-indigo-600': 'text-info-600',
  'text-indigo-700': 'text-info-700',
  'text-indigo-800': 'text-info-800',
  'border-indigo-500': 'border-info-500',
  'ring-indigo-500': 'ring-info-500',

  // Semantic colors
  'bg-destructive': 'bg-error-500',
  'text-destructive': 'text-error-600',
  'border-destructive': 'border-error-500',
  'bg-secondary': 'bg-secondary-500',
  'text-secondary': 'text-secondary-600',
  'bg-accent': 'bg-accent-500',
  'text-accent-foreground': 'text-text-on-accent',
  'bg-muted': 'bg-background-secondary',
  'text-muted-foreground': 'text-text-secondary',
  'border-border': 'border-border-base',
  'ring-ring': 'ring-primary-500',

  // Card and surface colors
  'bg-card': 'bg-background-primary',
  'text-card-foreground': 'text-text-primary',
  'text-foreground': 'text-text-primary',
  'text-background': 'text-text-primary',
  'bg-background': 'bg-background-primary',
  'hover:bg-accent': 'hover:bg-accent-500',
  'hover:text-accent-foreground': 'hover:text-text-on-accent',

  // Divide effects
  'divide-gray-200': 'divide-border-base',
  'divide-gray-300': 'divide-border-base',

  // Focus ring
  'focus:ring-2': 'focus:ring-2',
  'focus:ring-offset-2': 'focus:ring-offset-2',
};

// 需要处理的目录
const directories = [
  'packages/core/src/primitives',
  'packages/core/src/data-display',
  'packages/core/src/layout',
  'packages/core/src/navigation',
  'packages/core/src/feedback',
  'packages/core/src/overlays',
  'packages/core/src/loading',
  'packages/core/src/motion',
  'packages/core/src/examples'
];

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 转换单个文件
function convertFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 创建备份
    const backupPath = `${filePath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, originalContent);
    }

    // 应用颜色映射
    let changes = 0;
    Object.entries(colorMappings).forEach(([oldClass, newClass]) => {
      const regex = new RegExp(oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newClass);
        changes += matches.length;
      }
    });

    // 如果有变化，写入文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, changes, filePath };
    }

    return { success: true, changes: 0, filePath };
  } catch (error) {
    return { success: false, error: error.message, filePath };
  }
}

// 主函数
function main() {
  console.log('🎨 Xorigo UI 主题转换工具');
  console.log('===============================\n');

  let totalFiles = 0;
  let successfulFiles = 0;
  let totalChanges = 0;
  const failedFiles = [];
  const changedFiles = [];

  // 处理每个目录
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  目录不存在: ${dir}`);
      return;
    }

    console.log(`📁 处理目录: ${dir}`);
    const files = getAllFiles(dir);
    totalFiles += files.length;

    files.forEach(file => {
      const result = convertFile(file);

      if (result.success) {
        successfulFiles++;
        totalChanges += result.changes;

        if (result.changes > 0) {
          changedFiles.push({
            path: file,
            changes: result.changes
          });
          console.log(`  ✅ ${path.relative('.', file)} - ${result.changes} 处修改`);
        }
      } else {
        failedFiles.push({
          path: file,
          error: result.error
        });
        console.log(`  ❌ ${path.relative('.', file)} - ${result.error}`);
      }
    });
  });

  // 输出结果
  console.log('\n📊 转换结果:');
  console.log('==================');
  console.log(`总文件数: ${totalFiles}`);
  console.log(`成功处理: ${successfulFiles}`);
  console.log(`处理失败: ${failedFiles.length}`);
  console.log(`总修改数: ${totalChanges}`);
  console.log(`已修改文件: ${changedFiles.length}`);

  if (changedFiles.length > 0) {
    console.log('\n📋 已修改的文件:');
    changedFiles.forEach(file => {
      console.log(`  ${file.path} (${file.changes} 处修改)`);
    });
  }

  if (failedFiles.length > 0) {
    console.log('\n❌ 失败的文件:');
    failedFiles.forEach(file => {
      console.log(`  ${file.path}: ${file.error}`);
    });
  }

  console.log('\n💡 后续建议:');
  console.log('1. 运行测试确保功能正常');
  console.log('2. 检查组件在不同主题下的显示效果');
  console.log('3. 验证 TypeScript 类型检查');
  console.log('4. 更新相关文档');

  console.log('\n🎉 主题转换完成!');
}

if (require.main === module) {
  main();
}