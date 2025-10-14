#!/usr/bin/env node

/**
 * 简单的页面内容检查工具
 * 专注于HTML和JavaScript内容分析
 */

const https = require('https');
const http = require('http');

async function checkGalleryPage() {
  console.log('🔍 简单Gallery页面检查...\n');

  const url = 'http://localhost:3100/gallery';

  try {
    // 获取页面内容
    console.log('📡 获取页面HTML内容...');
    const htmlContent = await fetchPageContent(url);

    if (!htmlContent) {
      console.error('❌ 无法获取页面内容');
      return;
    }

    console.log(`✅ 页面内容获取成功 (${htmlContent.length} bytes)\n`);

    // 基础检查
    console.log('📄 基础信息检查:');

    const hasTitle = htmlContent.includes('<title>组件库展示 - Xorigo UI</title>');
    const hasDescription = htmlContent.includes('浏览和探索 Xorigo UI 组件库的所有组件');
    const hasHtmlStructure = htmlContent.includes('<!DOCTYPE html>') && htmlContent.includes('<html') && htmlContent.includes('</html>');

    console.log(`   DOCTYPE: ${hasHtmlStructure ? '✅' : '❌'}`);
    console.log(`   页面标题: ${hasTitle ? '✅' : '❌'}`);
    console.log(`   页面描述: ${hasDescription ? '✅' : '❌'}`);

    // 检查脚本内容
    console.log('\n📦 脚本内容检查:');

    const scriptCount = (htmlContent.match(/<script/g) || []).length;
    const hasReactScripts = htmlContent.includes('React') || htmlContent.includes('__next_f');
    const hasGalleryScripts = htmlContent.includes('GalleryServer') || htmlContent.includes('GalleryContent');
    const has404Scripts = htmlContent.includes('NotFound') || htmlContent.includes('not-found');

    console.log(`   脚本标签: ${scriptCount} 个`);
    console.log(`   React脚本: ${hasReactScripts ? '✅' : '❌'}`);
    console.log(`   Gallery脚本: ${hasGalleryScripts ? '✅' : '❌'}`);
    console.log(`   404脚本: ${has404Scripts ? '❌' : '⚠️'}`);

    // 检查页面内容
    console.log('\n📄 页面内容分析:');

    const has404Content = htmlContent.includes('404') && htmlContent.includes('页面不存在');
    const hasGalleryContent = htmlContent.includes('Xorigo UI 组件库');
    const hasLoadingContent = htmlContent.includes('loading') || htmlContent.includes('skeleton');

    console.log(`   404内容: ${has404Content ? '❌' : '✅'}`);
    console.log(`   Gallery内容: ${hasGalleryContent ? '✅' : '❌'}`);
    console.log(`   加载状态: ${hasLoadingContent ? '⏳' : '✅'}`);

    // 检查CSS
    console.log('\n🎨 样式表检查:');

    const styleCount = (htmlContent.match(/<link[^>]*rel="stylesheet"/g) || []).length;
    const hasMainCSS = htmlContent.includes('app/layout.css');

    console.log(`   CSS文件: ${styleCount} 个`);
    console.log(`   主样式表: ${hasMainCSS ? '✅' : '❌'}`);

    // 检查Next.js特定内容
    console.log('\n⚡ Next.js检查:');

    const hasNextData = htmlContent.includes('__NEXT_DATA__');
    const hasNextScripts = htmlContent.includes('_next/static');
    const hasMainApp = htmlContent.includes('main-app.js');
    const hasGalleryPage = htmlContent.includes('gallery/page.js');

    console.log(`   Next数据: ${hasNextData ? '✅' : '❌'}`);
    console.log(`   Next脚本: ${hasNextScripts ? '✅' : '❌'}`);
    console.log(`   主应用脚本: ${hasMainApp ? '✅' : '❌'}`);
    console.log(`   Gallery页面脚本: ${hasGalleryPage ? '✅' : '❌'}`);

    // 检查错误模式
    console.log('\n🐛 错误模式检查:');

    const errorPatterns = [
      { name: 'TypeError', pattern: /TypeError/i },
      { name: 'ReferenceError', pattern: /ReferenceError/i },
      { name: 'Cannot read', pattern: /Cannot read propert(y|ies)/i },
      { name: 'undefined is not', pattern: /undefined is not/i },
      { name: 'null is not', pattern: /null is not/i }
    ];

    let errorsFound = 0;
    errorPatterns.forEach(({ name, pattern }) => {
      if (pattern.test(htmlContent)) {
        console.log(`   ❌ 发现${name}模式`);
        errorsFound++;
      }
    });

    if (errorsFound === 0) {
      console.log('   ✅ 未发现明显的错误模式');
    }

    // 检查React组件模式
    console.log('\n⚛️ React组件模式检查:');

    const reactPatterns = [
      { name: 'JSX模式', pattern: /\$\{[^}]*\}/ },
      { name: 'React组件', pattern: /createElement|jsxDEV/ },
      { name: 'React片段', pattern: /\$Sreact\./ },
      { name: 'ErrorBoundary', pattern: /ErrorBoundary|PageErrorBoundary/ }
    ];

    let reactComponentsFound = 0;
    reactPatterns.forEach(({ name, pattern }) => {
      if (pattern.test(htmlContent)) {
        console.log(`   ✅ 发现${name}`);
        reactComponentsFound++;
      }
    });

    if (reactComponentsFound === 0) {
      console.log('   ❌ 未发现React组件模式');
    }

    // 检查性能相关
    console.log('\n⚡ 性能检查:');

    const hasRAF = htmlContent.includes('requestAnimationFrame');
    const hasPerformance = htmlContent.includes('performance.now');
    const chunkSize = htmlContent.length;

    console.log(`   RequestAnimationFrame: ${hasRAF ? '✅' : '❌'}`);
    console.log(`   Performance API: ${hasPerformance ? '✅' : '❌'}`);
    console.log(`   内容大小: ${chunkSize > 100000 ? (chunkSize/1000).toFixed(1) + 'KB' : chunkSize + 'B'}`);

    // 页面类型判断
    console.log('\n🎯 页面类型判断:');

    const isServerError = htmlContent.includes('500 Internal Server Error');
    const isNotFound = has404Content;
    const isGalleryPage = hasTitle && hasGalleryScripts && !has404Content;
    const isLoading = hasLoadingContent && hasGalleryScripts;

    if (isServerError) {
      console.log('   ❌ 服务器错误 (500)');
    } else if (isNotFound) {
      console.log('   ❌ 页面未找到 (404)');
    } else if (isLoading) {
      console.log('   ⏳ Gallery页面正在加载');
    } else if (isGalleryPage) {
      console.log('   ✅ Gallery页面正常');
    } else {
      console.log('   ❓ 页面状态不明确');
    }

    // 综合评估
    console.log('\n📊 综合评估:');

    const metrics = {
      hasValidStructure: hasHtmlStructure,
      hasCorrectTitle: hasTitle,
      hasReactApp: hasReactScripts,
      hasGalleryContent: hasGalleryScripts,
      has404Content: has404Content,
      hasErrors: errorsFound > 0,
      hasReactComponents: reactComponentsFound > 0
    };

    const score = Object.values(metrics).filter(Boolean).length;
    const total = Object.keys(metrics).length;

    console.log(`   整体评分: ${score}/${total} (${(score/total*100).toFixed(1)}%)`);

    // 状态评估
    if (metrics.hasValidStructure && metrics.hasCorrectTitle && metrics.hasReactApp && metrics.hasGalleryContent && !metrics.has404Content) {
      console.log('   🎉 Gallery页面状态正常！');
    } else if (metrics.hasValidStructure && metrics.hasReactApp && metrics.hasGalleryContent && metrics.has404Content) {
      console.log('   ⚠️ Gallery页面存在渲染冲突');
      console.log('   💡 可能是客户端组件错误导致fallback到404');
    } else if (metrics.hasValidStructure && metrics.hasReactApp) {
      console.log('   ❓ 页面基础正常但内容异常');
    } else {
      console.log('   ❌ 页面存在严重问题');
    }

    // 具体问题分析
    console.log('\n🔍 具体问题分析:');

    const issues = [];
    if (!metrics.hasValidStructure) issues.push('HTML结构不完整');
    if (!metrics.hasCorrectTitle) issues.push('页面标题错误');
    if (!metrics.hasReactApp) issues.push('React应用未加载');
    if (!metrics.hasGalleryContent) issues.push('Gallery组件未找到');
    if (metrics.has404Content) issues.push('存在404错误内容');
    if (metrics.hasErrors) issues.push('发现JavaScript错误');

    if (issues.length === 0) {
      console.log('   ✅ 未发现明显问题');
    } else {
      console.log('   ❌ 发现问题:');
      issues.forEach((issue, index) => {
        console.log(`     ${index + 1}. ${issue}`);
      });
    }

    // 建议操作
    console.log('\n💡 建议操作:');

    if (metrics.has404Content && metrics.hasGalleryContent) {
      console.log('   1. 在浏览器中访问页面查看实际渲染状态');
      console.log('   2. 打开开发者工具检查控制台错误');
      console.log('   3. 检查Network面板确认资源加载');
      console.log('   4. 检查React组件是否正确挂载');
    } else if (!metrics.hasReactApp) {
      console.log('   1. 检查Next.js构建状态');
      console.log('   2. 确认JavaScript文件是否正确生成');
      console.log('   3. 检查依赖包是否正确安装');
    } else if (issues.length > 0) {
      console.log('   1. 根据上述问题进行针对性修复');
      console.log('   2. 重新启动开发服务器');
      console.log('   3. 清除浏览器缓存后重试');
    } else {
      console.log('   ✅ 页面状态良好，无需操作');
    }

  } catch (error) {
    console.error('❌ 页面检查失败:', error.message);
    console.error('   错误详情:', error.stack);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 连接失败，可能的原因:');
      console.log('   - Docker容器未运行');
      console.log('   - 端口3100未开放');
      console.log('   - 开发服务器未启动');
      console.log('   \n   尝试: docker ps | grep xorigo');
    }
  }
}

function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

// 运行检查
checkGalleryPage().catch(error => {
  console.error('💥 检查执行失败:', error.message);
  process.exit(1);
});