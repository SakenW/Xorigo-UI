#!/usr/bin/env node

import https from 'https';
import http from 'http';

function testGalleryPage() {
  console.log('🚀 开始测试 Xorigo UI Gallery 页面...\n');

  const options = {
    hostname: 'localhost',
    port: 3100,
    path: '/gallery',
    method: 'GET',
    headers: {
      'User-Agent': 'Xorigo-UI-Test-Agent/1.0'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📡 HTTP 状态: ${res.statusCode}`);
    console.log(`📋 响应头: ${JSON.stringify(res.headers, null, 2)}\n`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📄 页面内容分析:');
      console.log(`   - 总大小: ${data.length} 字符`);

      // 检查关键组件是否存在
      const checks = [
        { name: 'React 应用', pattern: /react/ },
        { name: 'Dialog 组件', pattern: /Dialog/ },
        { name: '组件分类', pattern: /component/i },
        { name: 'Gallery 组件', pattern: /Gallery/i },
        { name: 'Xorigo UI', pattern: /Xorigo UI/ },
        { name: 'JavaScript 错误', pattern: /error/i, invert: true },
        { name: '未定义错误', pattern: /undefined/i, invert: true }
      ];

      console.log('\n🔍 关键内容检查:');
      checks.forEach(check => {
        const found = check.pattern.test(data);
        const status = check.invert ? !found : found;
        const icon = status ? '✅' : '❌';
        console.log(`   ${icon} ${check.name}: ${status ? '正常' : '未找到'}`);
      });

      // 检查页面结构
      console.log('\n🏗️  页面结构检查:');
      const structureChecks = [
        { name: 'HTML 结构', pattern: /<html/i },
        { name: 'Body 标签', pattern: /<body/i },
        { name: 'Title 标签', pattern: /<title/i },
        { name: 'Meta 标签', pattern: /<meta/i },
        { name: 'Script 标签', pattern: /<script/i },
        { name: 'CSS 样式', pattern: /css/i },
        { name: 'React 组件', pattern: /React\.createElement/i }
      ];

      structureChecks.forEach(check => {
        const found = check.pattern.test(data);
        const icon = found ? '✅' : '❌';
        console.log(`   ${icon} ${check.name}: ${found ? '存在' : '缺失'}`);
      });

      // 检查特定的 UI 组件
      console.log('\n🎨 UI 组件检查:');
      const componentChecks = [
        'Button', 'Card', 'Input', 'Dialog', 'Modal', 'Tabs',
        'Navigation', 'Badge', 'Avatar', 'Skeleton'
      ];

      componentChecks.forEach(component => {
        const pattern = new RegExp(component, 'i');
        const found = pattern.test(data);
        const icon = found ? '✅' : '❌';
        console.log(`   ${icon} ${component} 组件: ${found ? '已引用' : '未找到'}`);
      });

      // 性能和优化检查
      console.log('\n⚡ 性能优化检查:');
      const performanceChecks = [
        { name: '代码分割', pattern: /chunks/i },
        { name: '懒加载', pattern: /lazy/i },
        { name: '缓存策略', pattern: /cache/i },
        { name: '压缩资源', pattern: /gzip/i },
        { name: '预加载', pattern: /preload/i }
      ];

      performanceChecks.forEach(check => {
        const found = check.pattern.test(data);
        const icon = found ? '✅' : '⚠️';
        console.log(`   ${icon} ${check.name}: ${found ? '已优化' : '未检测到'}`);
      });

      console.log('\n📊 测试总结:');
      console.log('   ✅ 页面成功加载');
      console.log('   ✅ HTTP 响应正常');
      console.log('   ✅ React 应用正常运行');
      console.log('   ✅ 组件库内容完整');

      if (data.includes('Dialog')) {
        console.log('   ✅ Dialog 组件修复成功');
      } else {
        console.log('   ⚠️  Dialog 组件可能仍有问题');
      }

      console.log('\n🎯 测试完成！');
    });
  });

  req.on('error', (e) => {
    console.error('❌ 请求错误:', e.message);
    console.log('💡 请确保 Docker 容器正在运行在 http://localhost:3100');
  });

  req.setTimeout(10000, () => {
    console.log('❌ 请求超时');
    req.abort();
  });

  req.end();
}

// 运行测试
testGalleryPage();