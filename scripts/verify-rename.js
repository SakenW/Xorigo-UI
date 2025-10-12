#!/usr/bin/env node

/**
 * Xorigo UI 重命名验证脚本
 * 验证重命名是否完成，检查是否还有遗漏的 TH-UI 引用
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 定义颜色
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');

console.log(`${colors.blue}🔍 Xorigo UI 重命名验证${colors.reset}`);
console.log(`${colors.blue}📁 项目根目录: ${projectRoot}${colors.reset}\n`);

// 需要检查的文件类型
const fileExtensions = ['.json', '.md', '.ts', '.tsx', '.js', '.jsx'];
const excludeDirs = ['node_modules', 'dist', '.next', 'out', 'coverage', 'backup-*'];

// 搜索需要检查的文件
function findFiles(dir, extensions, exclude) {
  let files = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 检查是否应该排除
      const shouldExclude = exclude.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(item);
      });

      if (!shouldExclude) {
        files = files.concat(findFiles(fullPath, extensions, exclude));
      }
    } else if (stat.isFile()) {
      // 检查文件扩展名
      const ext = path.extname(item);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// 搜索文件中的模式
function searchInFile(filePath, patterns) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];

    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        matches.push({
          pattern,
          match: match[0],
          line: content.substring(0, match.index).split('\n').length,
          index: match.index
        });
      }
    }

    return matches;
  } catch (error) {
    return [];
  }
}

console.log(`${colors.cyan}📂 搜索文件中...${colors.reset}`);

const allFiles = findFiles(projectRoot, fileExtensions, excludeDirs);
console.log(`${colors.cyan}找到 ${allFiles.length} 个文件需要检查${colors.reset}\n`);

// 搜索模式（这些模式不应该再存在）
const searchPatterns = [
  'TH-UI',           // 大写品牌名
  'th-ui',           // 小写标识符
  '@th-ui',          // 包名前缀
  'TH-UI Team',      // 团队名
  'th-ui-locale',    // 本地存储键
  'th-ui-locale-change', // 事件名
  'th-ui.dev',       // 域名
  'github.com/th-ui' // GitHub URL
];

let totalIssues = 0;
const problematicFiles = [];

console.log(`${colors.yellow}🔍 检查文件内容...${colors.reset}`);

// 检查每个文件
for (const file of allFiles) {
  const matches = searchInFile(file, searchPatterns);

  if (matches.length > 0) {
    totalIssues += matches.length;
    problematicFiles.push({ file, matches });
  }
}

// 输出结果
if (totalIssues === 0) {
  console.log(`${colors.green}✅ 恭喜！没有发现遗漏的 TH-UI 引用${colors.reset}`);
  console.log(`${colors.green}🎉 重命名验证通过！${colors.reset}`);
} else {
  console.log(`${colors.red}❌ 发现 ${totalIssues} 个问题需要修复${colors.reset}\n`);

  // 显示详细问题
  for (const { file, matches } of problematicFiles) {
    const relativePath = path.relative(projectRoot, file);
    console.log(`${colors.yellow}📄 ${relativePath}${colors.reset}`);

    for (const match of matches) {
      console.log(`  ${colors.red}• 第 ${match.line} 行: "${match.match}"${colors.reset}`);
    }
    console.log('');
  }

  console.log(`${colors.cyan}💡 建议手动修复这些问题，或重新运行重命名脚本${colors.reset}`);
}

// 验证包名
console.log(`\n${colors.cyan}📦 验证包名...${colors.reset}`);

const packageFiles = [
  'package.json',
  'packages/core/package.json',
  'packages/tokens/package.json',
  'packages/style-recipe/package.json',
  'packages/i18n/package.json',
  'packages/registry/package.json',
  'apps/website/package.json'
];

let packageIssues = 0;

for (const pkgFile of packageFiles) {
  const fullPath = path.join(projectRoot, pkgFile);

  if (fs.existsSync(fullPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const relativePath = path.relative(projectRoot, fullPath);

      // 检查包名
      if (pkg.name && pkg.name.includes('th-ui')) {
        console.log(`${colors.red}❌ ${relativePath}: 包名包含旧名称 "${pkg.name}"${colors.reset}`);
        packageIssues++;
      }

      // 检查描述
      if (pkg.description && pkg.description.includes('TH-UI')) {
        console.log(`${colors.red}❌ ${relativePath}: 描述包含旧品牌名${colors.reset}`);
        packageIssues++;
      }

      // 检查关键词
      if (pkg.keywords) {
        const thuiKeywords = pkg.keywords.filter(k => k.includes('th-ui'));
        if (thuiKeywords.length > 0) {
          console.log(`${colors.red}❌ ${relativePath}: 关键词包含旧名称: ${thuiKeywords.join(', ')}${colors.reset}`);
          packageIssues++;
        }
      }

    } catch (error) {
      console.log(`${colors.yellow}⚠️  无法读取 ${relativePath}: ${error.message}${colors.reset}`);
    }
  }
}

if (packageIssues === 0) {
  console.log(`${colors.green}✅ 所有包名检查通过${colors.reset}`);
} else {
  console.log(`${colors.red}❌ 发现 ${packageIssues} 个包名问题${colors.reset}`);
}

// 验证配置文件
console.log(`\n${colors.cyan}🔧 验证配置文件...${colors.reset}`);

const oldConfigFile = path.join(projectRoot, 'th-ui.config.json');
const newConfigFile = path.join(projectRoot, 'xorigo-ui.config.json');

if (fs.existsSync(oldConfigFile)) {
  console.log(`${colors.red}❌ 旧配置文件仍然存在: th-ui.config.json${colors.reset}`);
  totalIssues++;
} else if (fs.existsSync(newConfigFile)) {
  console.log(`${colors.green}✅ 配置文件已正确重命名${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠️  没有找到配置文件${colors.reset}`);
}

// 总结
console.log(`\n${colors.blue}📊 验证总结${colors.reset}`);
console.log(`总计发现问题: ${totalIssues + packageIssues}`);

if ((totalIssues + packageIssues) === 0) {
  console.log(`${colors.green}🎉 重命名完全成功！Xorigo UI 已经准备就绪！${colors.reset}`);
  console.log(`\n${colors.cyan}下一步建议:${colors.reset}`);
  console.log(`1. 运行 npm run build 测试构建`);
  console.log(`2. 运行 npm run dev 测试开发环境`);
  console.log(`3. 提交代码变更`);
} else {
  console.log(`${colors.red}⚠️  还有一些问题需要解决${colors.reset}`);
  console.log(`\n${colors.cyan}修复建议:${colors.reset}`);
  console.log(`1. 手动修复上述发现的问题`);
  console.log(`2. 重新运行验证脚本`);
}

process.exit((totalIssues + packageIssues) === 0 ? 0 : 1);