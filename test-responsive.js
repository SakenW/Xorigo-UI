#!/usr/bin/env node

import http from 'http';
import fs from 'fs';

function testResponsiveDesign() {
  console.log('📱 开始响应式设计测试...\n');

  const pages = [
    { name: 'Gallery 主页', path: '/gallery' },
    { name: 'Playground', path: '/playground' },
    { name: '文档页面', path: '/docs' }
  ];

  const checks = [
    { name: '响应式 Meta 标签', pattern: /viewport/i },
    { name: '移动端优化', pattern: /mobile|responsive|touch/i },
    { name: 'CSS Grid', pattern: /grid|grid-template/i },
    { name: 'Flexbox', pattern: /flex|flexbox/i },
    { name: 'Tailwind CSS', pattern: /tailwind|tw-/i },
    { name: '媒体查询', pattern: /@media|media:|min-width|max-width/i }
  ];

  let allTestsPassed = true;

  pages.forEach(page => {
    console.log(`🔍 测试 ${page.name}: ${page.path}`);

    const options = {
      hostname: 'localhost',
      port: 3100,
      path: page.path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`   📊 响应大小: ${data.length} 字节`);

        let pagePassed = true;
        checks.forEach(check => {
          const found = check.pattern.test(data);
          const icon = found ? '✅' : '⚠️';
          console.log(`   ${icon} ${check.name}: ${found ? '已实现' : '未检测到'}`);
          if (!found && check.name !== '媒体查询') {
            pagePassed = false;
          }
        });

        // 检查现代 CSS 特性
        const modernFeatures = [
          { name: 'CSS 变量', pattern: /--[\w-]+:/ },
          { name: '渐变背景', pattern: /gradient|linear-gradient/i },
          { name: '阴影效果', pattern: /shadow|box-shadow/i },
          { name: '圆角设计', pattern: /rounded|border-radius/i }
        ];

        console.log('   🎨 现代特性:');
        modernFeatures.forEach(feature => {
          const found = feature.pattern.test(data);
          const icon = found ? '✅' : '⚠️';
          console.log(`      ${icon} ${feature.name}: ${found ? '已使用' : '未使用'}`);
        });

        if (pagePassed) {
          console.log(`   ✅ ${page.name}: 响应式设计良好`);
        } else {
          console.log(`   ⚠️ ${page.name}: 部分响应式特性缺失`);
          allTestsPassed = false;
        }
        console.log('');
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ 错误: ${e.message}`);
      allTestsPassed = false;
    });

    req.setTimeout(5000, () => {
      console.log('   ⏰ 超时');
      req.abort();
    });

    req.end();
  });
}

// 等待所有测试完成
setTimeout(() => {
  console.log('📱 响应式设计测试完成！');

  // 清理测试文件
  console.log('\n🧹 清理测试文件...');

  // 删除测试脚本
  const fs = require('fs');
  const files = [
    'test-gallery.js',
    'test-gallery-advanced.js',
    'test-responsive.js'
  ];

  files.forEach(file => {
    try {
      fs.unlinkSync(file);
      console.log(`   ✅ 删除 ${file}`);
    } catch (e) {
      console.log(`   ⚠️ 无法删除 ${file}: ${e.message}`);
    }
  });

  console.log('\n🎉 所有测试完成！');
}, 8000);

testResponsiveDesign();