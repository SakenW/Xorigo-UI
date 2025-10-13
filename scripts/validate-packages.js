#!/usr/bin/env node
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const REQUIRED_FILES = ['package.json', 'README.md', 'src/index.ts'];
const packagesDir = join(process.cwd(), 'packages');
const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let hasErrors = false;

console.log('🔍 验证 Packages 结构...\n');

packages.forEach(pkg => {
  console.log(`📦 验证包: @xorigo-ui/${pkg}`);
  const pkgPath = join(packagesDir, pkg);

  REQUIRED_FILES.forEach(file => {
    const filePath = join(pkgPath, file);
    if (!existsSync(filePath)) {
      console.error(`  ❌ 缺失: ${file}`);
      hasErrors = true;
    } else {
      console.log(`  ✅ ${file}`);
    }
  });
  console.log('');
});

if (hasErrors) {
  console.error('❌ 包结构验证失败');
  process.exit(1);
} else {
  console.log('✅ 所有包结构验证通过');
}
