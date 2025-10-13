#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import {
  executeAddCommand,
  executeTokensExportCommand,
  executeI18nExtractCommand,
  executeRegistryScanCommand,
  checkKeyboardNavigation,
  checkOverlayAccessibility,
  checkVirtualization,
  runDoctor,
  runSync,
} from '../src/index.js';

program
  .name('xorigo')
  .description('Xorigo UI CLI - Component scaffolding and quality checks')
  .version('1.0.0');

// ================================
// 组件生成命令
// ================================
program
  .command('add <component>')
  .description('Generate component scaffold with TypeScript, tests, and documentation')
  .option('-t, --template <type>', 'Component template (basic|advanced|form)', 'basic')
  .option('-c, --category <category>', 'Component category (base|feedback|navigation|form|data|layout)')
  .option('-p, --path <path>', 'Custom output path')
  .action(async (component, options) => {
    try {
      await executeAddCommand(component, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ================================
// 设计令牌导出命令
// ================================
program
  .command('tokens:export')
  .description('Export design tokens to various formats (CSS, SCSS, JSON)')
  .option('-f, --format <type>', 'Output format (css|scss|json|all)', 'css')
  .option('-o, --output <path>', 'Output directory', './tokens')
  .option('-t, --theme <theme>', 'Theme name (optional)')
  .action(async (options) => {
    try {
      await executeTokensExportCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ================================
// 国际化命令
// ================================
program
  .command('i18n:extract')
  .description('Extract i18n strings from components')
  .option('-l, --locales <locales...>', 'Target locales', ['en', 'zh'])
  .option('-s, --source <path>', 'Source directory to scan')
  .option('-o, --output <path>', 'Output directory for locale files')
  .option('--overwrite', 'Overwrite existing translations', false)
  .action(async (options) => {
    try {
      await executeI18nExtractCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ================================
// 组件注册表命令
// ================================
program
  .command('registry:scan')
  .description('Scan and update component metadata registry')
  .option('-p, --packages <packages...>', 'Packages to scan (defaults to core and registry)')
  .option('-o, --output <path>', 'Output directory')
  .option('-i, --incremental', 'Incremental update (merge with existing registry)', false)
  .action(async (options) => {
    try {
      await executeRegistryScanCommand(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ================================
// 质量检查命令组
// ================================
const checkCmd = program.command('check').description('Quality and accessibility checks');

checkCmd
  .command('keyboard')
  .description('Check keyboard navigation compliance (Tab, Enter, Esc, Arrow keys)')
  .option('-p, --path <path>', 'Path to check')
  .option('-f, --fix', 'Auto-fix issues where possible', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options) => {
    try {
      await checkKeyboardNavigation(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

checkCmd
  .command('overlay')
  .description('Check overlay accessibility (focus trap, Esc close, ARIA)')
  .option('-p, --path <path>', 'Path to check')
  .option('-f, --fix', 'Auto-fix issues where possible', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options) => {
    try {
      await checkOverlayAccessibility(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

checkCmd
  .command('virtualization')
  .description('Check virtualization performance for large lists')
  .option('-p, --path <path>', 'Path to check')
  .option('-f, --fix', 'Auto-fix issues where possible', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options) => {
    try {
      await checkVirtualization(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ================================
// 健康检查命令
// ================================
program
  .command('doctor')
  .description('Execute comprehensive system health checks')
  .option('-p, --path <path>', 'Project path to check', process.cwd())
  .option('--fix', 'Auto-fix issues where possible', false)
  .option('-v, --verbose', 'Verbose output', false)
  .option('-r, --report <path>', 'Save report to file')
  .action(async (options) => {
    try {
      await runDoctor(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ================================
// 文档同步命令
// ================================
program
  .command('sync')
  .description('Sync documentation and component information')
  .option('-w, --watch', 'Watch for file changes and auto-sync', false)
  .option('-o, --output <path>', 'Output directory', './docs/generated')
  .option('-v, --verbose', 'Verbose output', false)
  .option('--no-examples', 'Do not generate example code', false)
  .option('--no-props', 'Do not generate props documentation', false)
  .option('--no-index', 'Do not generate search index', false)
  .action(async (options) => {
    try {
      await runSync(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ================================
// 帮助和错误处理
// ================================

// 显示帮助信息
program.on('--help', () => {
  console.log();
  console.log(chalk.bold('Examples:'));
  console.log();
  console.log('  $ xorigo add Button -t basic -c base');
  console.log('  $ xorigo tokens:export -f all -o ./design-tokens');
  console.log('  $ xorigo i18n:extract -l en zh-CN ja');
  console.log('  $ xorigo registry:scan -i');
  console.log('  $ xorigo check keyboard -v');
  console.log('  $ xorigo doctor --fix');
  console.log('  $ xorigo sync --watch');
  console.log();
  console.log(chalk.bold('Documentation:'));
  console.log('  https://xorigo-ui.dev/docs/cli');
  console.log();
});

// 错误处理
program.on('command:*', (operands) => {
  console.error(chalk.red(`❌ Unknown command: ${operands[0]}`));
  console.log(chalk.gray('   Run "xorigo --help" to see available commands'));
  process.exit(1);
});

// 解析命令行参数
program.parse();
