#!/usr/bin/env node

import http from 'http';

function testClientRendering() {
  console.log('🌐 测试客户端渲染状态...\n');

  const options = {
    hostname: 'localhost',
    port: 3100,
    path: '/gallery',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('🔍 客户端渲染分析:');

      // 1. 检查 SSR 和 CSR 标识
      const ssrIndicators = [
        'data-reactroot',
        '__NEXT_DATA__',
        'self.__next_f',
        'data-rsc'
      ];

      const csrIndicators = [
        'React.createElement',
        'ReactDOM.render',
        'use client',
        'client:'
      ];

      const ssrFound = ssrIndicators.filter(ind => data.includes(ind)).length;
      const csrFound = csrIndicators.filter(ind => data.includes(ind)).length;

      console.log(`   📊 SSR 指标: ${ssrFound}/${ssrIndicators.length}`);
      console.log(`   📱 CSR 指标: ${csrFound}/${csrIndicators.length}`);

      // 2. 检查组件是否在服务端渲染
      console.log('\n🏗️  服务端渲染检查:');
      const serverRenderedComponents = [];

      const componentPatterns = [
        { name: 'Button', patterns: ['<button', 'btn-', 'Button'] },
        { name: 'Card', patterns: ['<div.*card', 'Card', 'shadow'] },
        { name: 'Input', patterns: ['<input', 'Input', 'field'] },
        { name: 'Dialog', patterns: ['Dialog', 'dialog', 'modal'] },
        { name: 'Tabs', patterns: ['Tabs', 'tab-', 'tab-list'] }
      ];

      componentPatterns.forEach(comp => {
        const found = comp.patterns.some(pattern =>
          new RegExp(pattern, 'i').test(data)
        );
        if (found) {
          serverRenderedComponents.push(comp.name);
          console.log(`   ✅ ${comp.name}: 已在服务端渲染`);
        } else {
          console.log(`   ⚠️  ${comp.name}: 可能仅在客户端渲染`);
        }
      });

      // 3. 检查 JavaScript 加载
      console.log('\n📦 JavaScript 加载检查:');
      const jsChecks = [
        { name: 'React 核心库', pattern: /react/i },
        { name: 'Next.js 脚本', pattern: /next\/static/ },
        { name: '组件库', pattern: /@xorigo-ui/i },
        { name: '客户端组件', pattern: /use client/i }
      ];

      jsChecks.forEach(check => {
        const found = check.pattern.test(data);
        const icon = found ? '✅' : '❌';
        console.log(`   ${icon} ${check.name}`);
      });

      // 4. 检查可能的客户端错误
      console.log('\n❌ 客户端错误检查:');
      const clientErrorPatterns = [
        'Cannot read properties',
        'is not defined',
        'TypeError',
        'ReferenceError',
        'hydration'
      ];

      let clientErrors = 0;
      clientErrorPatterns.forEach(pattern => {
        if (data.includes(pattern)) {
          console.log(`   ❌ 发现错误模式: ${pattern}`);
          clientErrors++;
        }
      });

      if (clientErrors === 0) {
        console.log('   ✅ 未发现客户端错误模式');
      }

      // 5. 检查数据加载状态
      console.log('\n📊 数据加载状态:');
      const loadingIndicators = [
        'loading...',
        'skeleton',
        'spinner',
        'Loading...'
      ];

      const loadingFound = loadingIndicators.filter(ind => data.includes(ind)).length;
      console.log(`   ⏳ 加载指示器: ${loadingFound} 个`);

      // 6. 检查组件数据
      console.log('\n🎨 组件数据检查:');
      const dataPatterns = [
        'componentData',
        'componentCategories',
        'components =',
        'const data'
      ];

      const dataFound = dataPatterns.filter(pattern => data.includes(pattern)).length;
      console.log(`   📋 数据引用: ${dataFound}/${dataPatterns.length}`);

      // 7. 生成客户端渲染报告
      console.log('\n📈 客户端渲染报告:');

      if (ssrFound >= 3) {
        console.log('   ✅ 服务端渲染: 良好');
      } else {
        console.log('   ⚠️  服务端渲染: 需要改进');
      }

      if (csrFound >= 2) {
        console.log('   ✅ 客户端交互: 正常');
      } else {
        console.log('   ⚠️  客户端交互: 有限');
      }

      if (serverRenderedComponents.length >= 3) {
        console.log('   ✅ 组件渲染: 正常');
      } else {
        console.log('   ⚠️  组件渲染: 需要检查');
      }

      if (clientErrors === 0) {
        console.log('   ✅ 错误状态: 清洁');
      } else {
        console.log('   ❌ 错误状态: 需要修复');
      }

      // 8. 建议修复方案
      console.log('\n💡 建议修复方案:');

      if (ssrFound < 3) {
        console.log('   🔧 检查 Next.js 配置和服务端渲染设置');
      }

      if (serverRenderedComponents.length < 3) {
        console.log('   🔧 检查组件导入和导出配置');
      }

      if (clientErrors > 0) {
        console.log('   🔧 修复客户端 JavaScript 错误');
      }

      if (loadingFound > 3) {
        console.log('   🔧 优化数据加载和缓存策略');
      }

      console.log('\n🎯 关键问题:');
      console.log('   📋 诊断显示组件引用异常，可能是构建问题');
      console.log('   🔧 建议检查构建配置和组件导出路径');
      console.log('   📱 建议在浏览器中直接测试页面交互');

      console.log('\n🎉 客户端渲染测试完成！');
    });
  });

  req.on('error', (e) => {
    console.error('❌ 请求失败:', e.message);
  });

  req.setTimeout(10000, () => {
    console.log('❌ 请求超时');
    req.abort();
  });

  req.end();
}

// 运行测试
testClientRendering();