#!/usr/bin/env node

import http from 'http';

function diagnoseGalleryIssues() {
  console.log('🔍 开始深度诊断 Xorigo UI Gallery 页面...\n');

  const options = {
    hostname: 'localhost',
    port: 3100,
    path: '/gallery',
    method: 'GET',
    headers: {
      'User-Agent': 'Xorigo-Diagnostic-Agent/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('📊 页面诊断结果:');
      console.log(`   - HTTP 状态: ${res.statusCode}`);
      console.log(`   - 页面大小: ${data.length.toLocaleString()} 字节`);
      console.log(`   - 内容类型: ${res.headers['content-type']}`);

      // 1. 检查 React 应用状态
      console.log('\n🚀 React 应用状态:');
      const reactIndicators = [
        'React.createElement',
        'useCallback',
        'useState',
        'useEffect',
        'useRef'
      ];

      const reactFound = reactIndicators.filter(indicator => data.includes(indicator)).length;
      console.log(`   ✅ React 组件: ${reactFound}/${reactIndicators.length} 个关键函数`);

      // 2. 检查组件库完整性
      console.log('\n🎨 组件库完整性检查:');
      const expectedComponents = [
        'Button', 'Card', 'Input', 'Dialog', 'Modal', 'Tabs',
        'Navigation', 'Badge', 'Avatar', 'Skeleton', 'Alert',
        'Drawer', 'Popover', 'Tooltip', 'Slider', 'Switch'
      ];

      const foundComponents = expectedComponents.filter(comp =>
        new RegExp(`"${comp}"|${comp}\\s*:`, 'i').test(data)
      );

      console.log(`   ✅ 已引用组件: ${foundComponents.length}/${expectedComponents.length} 个`);

      foundComponents.forEach(comp => {
        console.log(`      ✅ ${comp}`);
      });

      const missingComponents = expectedComponents.filter(comp =>
        !new RegExp(`"${comp}"|${comp}\\s*:`, 'i').test(data)
      );

      if (missingComponents.length > 0) {
        console.log(`   ⚠️  缺失组件: ${missingComponents.join(', ')}`);
      }

      // 3. 检查 JavaScript 错误模式
      console.log('\n❌ JavaScript 错误模式检查:');
      const errorPatterns = [
        'is not defined',
        'Cannot read property',
        'TypeError',
        'ReferenceError',
        'undefined is not',
        'null is not'
      ];

      let errorsFound = 0;
      errorPatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'i');
        const matches = data.match(regex);
        if (matches) {
          console.log(`   ❌ 发现错误模式: ${pattern} (${matches.length} 次)`);
          errorsFound += matches.length;
        }
      });

      if (errorsFound === 0) {
        console.log('   ✅ 未发现 JavaScript 错误模式');
      }

      // 4. 检查构建产物
      console.log('\n📦 构建产物检查:');
      const buildIndicators = [
        '_next/static',
        'chunks/',
        'webpack-',
        'data-reactroot',
        'self.__next_f'
      ];

      const buildFound = buildIndicators.filter(indicator => data.includes(indicator)).length;
      console.log(`   ✅ 构建指标: ${buildFound}/${buildIndicators.length} 个`);

      // 5. 检查页面结构完整性
      console.log('\n🏗️  页面结构完整性:');
      const structureChecks = [
        { name: 'HTML DOCTYPE', pattern: /<!DOCTYPE html>/i },
        { name: 'Head 标签', pattern: /<head/i },
        { name: 'Body 标签', pattern: /<body/i },
        { name: '页面标题', pattern: /<title/i },
        { name: 'Meta 描述', pattern: /name="description"/i },
        { name: 'React 根节点', pattern: /data-reactroot/i }
      ];

      structureChecks.forEach(check => {
        const found = check.pattern.test(data);
        const icon = found ? '✅' : '❌';
        console.log(`   ${icon} ${check.name}`);
      });

      // 6. 检查性能优化
      console.log('\n⚡ 性能优化检查:');
      const performanceChecks = [
        { name: '代码分割', pattern: /chunks/i },
        { name: '预加载', pattern: /preload|prefetch/i },
        { name: '异步加载', pattern: /async|defer/i },
        { name: '缓存控制', pattern: /cache-control/i },
        { name: '压缩', pattern: /gzip|compress/i }
      ];

      performanceChecks.forEach(check => {
        const found = check.pattern.test(data);
        const icon = found ? '✅' : '⚠️';
        console.log(`   ${icon} ${check.name}`);
      });

      // 7. 检查特定组件状态
      console.log('\n🔧 核心组件状态:');
      const criticalComponents = [
        { name: 'Dialog 组件', pattern: /Dialog[^a-zA-Z]/, required: true },
        { name: 'Drawer 组件', pattern: /Drawer[^a-zA-Z]/, required: false },
        { name: 'Modal 组件', pattern: /Modal[^a-zA-Z]/, required: false },
        { name: 'Button 组件', pattern: /Button[^a-zA-Z]/, required: true },
        { name: 'Card 组件', pattern: /Card[^a-zA-Z]/, required: true }
      ];

      criticalComponents.forEach(comp => {
        const found = comp.pattern.test(data);
        const icon = found ? '✅' : (comp.required ? '❌' : '⚠️');
        const status = found ? '正常' : (comp.required ? '缺失' : '未找到');
        console.log(`   ${icon} ${comp.name}: ${status}`);
      });

      // 8. 生成健康评分
      console.log('\n📈 页面健康评分:');

      let score = 0;
      let total = 0;

      // React 应用 (25分)
      score += Math.min(reactFound / reactIndicators.length * 25, 25);
      total += 25;

      // 组件完整性 (30分)
      score += Math.min(foundComponents.length / expectedComponents.length * 30, 30);
      total += 30;

      // 错误检查 (25分)
      score += errorsFound === 0 ? 25 : Math.max(0, 25 - errorsFound * 5);
      total += 25;

      // 结构完整性 (20分)
      const structScore = structureChecks.filter(check => check.pattern.test(data)).length;
      score += Math.min(structScore / structureChecks.length * 20, 20);
      total += 20;

      const finalScore = Math.round((score / total) * 100);

      let grade = 'F';
      if (finalScore >= 95) grade = 'A+';
      else if (finalScore >= 90) grade = 'A';
      else if (finalScore >= 85) grade = 'B+';
      else if (finalScore >= 80) grade = 'B';
      else if (finalScore >= 75) grade = 'C+';
      else if (finalScore >= 70) grade = 'C';
      else if (finalScore >= 65) grade = 'D+';

      console.log(`   🎯 总分: ${finalScore}/100 (${grade})`);

      // 9. 建议和下一步行动
      console.log('\n💡 建议和下一步行动:');

      if (errorsFound > 0) {
        console.log('   🔴 发现 JavaScript 错误，需要立即修复');
      }

      if (missingComponents.length > 0) {
        console.log(`   🟡 缺失组件: ${missingComponents.join(', ')}`);
      }

      if (finalScore < 90) {
        console.log('   🟡 页面健康度需要改进');
      }

      if (errorsFound === 0 && finalScore >= 90) {
        console.log('   🟢 页面状态良好，可以正常使用');
      }

      console.log('\n🎉 诊断完成！');
    });
  });

  req.on('error', (e) => {
    console.error('❌ 请求失败:', e.message);
    console.log('💡 请确保 Docker 容器在 http://localhost:3100 运行');
  });

  req.setTimeout(10000, () => {
    console.log('❌ 请求超时');
    req.abort();
  });

  req.end();
}

// 运行诊断
diagnoseGalleryIssues();