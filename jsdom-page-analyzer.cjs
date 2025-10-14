#!/usr/bin/env node

/**
 * 使用JSDOM模拟浏览器环境的页面分析工具
 * 可以执行JavaScript并检查DOM状态
 */

const { JSDOM } = require('jsdom');
const https = require('https');
const http = require('http');

async function analyzeGalleryPage() {
  console.log('🔍 使用JSDOM分析Gallery页面...\n');

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

    // 创建虚拟DOM环境
    console.log('🌐 创建虚拟DOM环境...');
    const dom = new JSDOM(htmlContent, {
      url: url,
      pretendToBeVisual: true,
      resources: 'usable'
    });

    const { document, window } = dom;
    const { performance } = window;

    // 模拟页面加载完成
    window.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    window.dispatchEvent(new dom.window.Event('load'));

    console.log('✅ DOM环境创建完成\n');

    // 基础页面信息
    console.log('📄 页面基础信息:');
    const title = document.querySelector('title');
    console.log(`   标题: ${title ? title.textContent : '未找到'}`);

    const description = document.querySelector('meta[name="description"]');
    console.log(`   描述: ${description ? description.getAttribute('content') : '未找到'}`);

    // 检查React应用状态
    console.log('\n⚛️ React应用状态检查:');

    // 查找React根元素
    const reactRoots = [
      document.getElementById('root'),
      document.getElementById('__next'),
      document.querySelector('[data-reactroot]'),
      document.querySelector('[id*="app"]')
    ].filter(Boolean);

    console.log(`   React根元素: ${reactRoots.length} 个`);

    if (reactRoots.length > 0) {
      reactRoots.forEach((root, index) => {
        console.log(`     ${index + 1}. ${root.id || root.tagName}: ${root.children.length} 个子元素`);
      });
    }

    // 检查是否有React脚本标记
    const scripts = Array.from(document.querySelectorAll('script'));
    const hasReactScripts = scripts.some(script =>
      script.textContent && (
        script.textContent.includes('React') ||
        script.textContent.includes('__next_f') ||
        script.textContent.includes('requestAnimationFrame')
      )
    );

    console.log(`   React脚本: ${hasReactScripts ? '✅' : '❌'}`);

    // 检查错误和404内容
    console.log('\n🚨 错误和404检查:');

    const errorSelectors = [
      '.error', '.error-message', '[data-error]', '.error-boundary',
      '.exception', '.failure', '.warning'
    ];

    let errorCount = 0;
    errorSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`   ❌ 发现 ${elements.length} 个 ${selector} 元素`);
        errorCount += elements.length;
      }
    });

    // 检查404内容
    const has404Title = document.body.textContent.includes('404');
    const has404Message = document.body.textContent.includes('页面不存在');
    const hasNotFound = scripts.some(script =>
      script.textContent && script.textContent.includes('NotFound')
    );

    if (has404Title || has404Message || hasNotFound) {
      console.log('   ❌ 发现404错误内容');
      errorCount++;
    } else {
      console.log('   ✅ 未发现404错误内容');
    }

    // 检查Gallery相关内容
    console.log('\n🧩 Gallery组件检查:');

    const hasGalleryTitle = document.body.textContent.includes('Xorigo UI');
    const hasGalleryComponent = scripts.some(script =>
      script.textContent && script.textContent.includes('GalleryServer')
    );
    const hasComponentNav = scripts.some(script =>
      script.textContent && script.textContent.includes('CategoryNavigation')
    );

    console.log(`   Gallery标题: ${hasGalleryTitle ? '✅' : '❌'}`);
    console.log(`   Gallery组件: ${hasGalleryComponent ? '✅' : '❌'}`);
    console.log(`   组件导航: ${hasComponentNav ? '✅' : '❌'}`);

    // 检查脚本加载状态
    console.log('\n📦 脚本加载检查:');
    const scriptsWithSrc = scripts.filter(script => script.src);
    const inlineScripts = scripts.filter(script => !script.src);

    console.log(`   外部脚本: ${scriptsWithSrc.length} 个`);
    console.log(`   内联脚本: ${inlineScripts.length} 个`);

    // 检查关键脚本是否加载
    const criticalScripts = [
      'main-app.js',
      'layout.js',
      'gallery/page.js',
      'webpack.js'
    ];

    criticalScripts.forEach(scriptName => {
      const found = scripts.some(script =>
        script.src && script.src.includes(scriptName)
      );
      console.log(`   ${scriptName}: ${found ? '✅' : '❌'}`);
    });

    // 模拟执行简单的JavaScript
    console.log('\n🔧 JavaScript执行检查:');
    try {
      // 尝试获取页面性能信息
      if (typeof window.performance !== 'undefined') {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          console.log(`   DOM内容加载: ${navigation.domContentLoadedEventEnd - navigation.navigationStart}ms`);
          console.log(`   页面完全加载: ${navigation.loadEventEnd - navigation.navigationStart}ms`);
        }
      }

      // 检查全局对象
      const hasWindowError = typeof window.onerror !== 'undefined';
      const hasConsole = typeof window.console !== 'undefined';
      const hasDocument = typeof window.document !== 'undefined';

      console.log(`   错误处理: ${hasWindowError ? '✅' : '❌'}`);
      console.log(`   控制台: ${hasConsole ? '✅' : '❌'}`);
      console.log(`   文档对象: ${hasDocument ? '✅' : '❌'}`);

    } catch (error) {
      console.log(`   ❌ JavaScript执行错误: ${error.message}`);
    }

    // 查找潜在的错误模式
    console.log('\n🐛 错误模式检查:');

    const htmlString = htmlContent;
    const errorPatterns = [
      { name: 'TypeError', pattern: /TypeError/i },
      { name: 'ReferenceError', pattern: /ReferenceError/i },
      { name: 'Cannot read', pattern: /Cannot read propert(y|ies)/i },
      { name: 'undefined is not', pattern: /undefined is not/i },
      { name: 'null is not', pattern: /null is not/i },
      { name: 'Module not found', pattern: /Module not found/i }
    ];

    let errorPatternsFound = 0;
    errorPatterns.forEach(({ name, pattern }) => {
      if (pattern.test(htmlString)) {
        console.log(`   ❌ 发现${name}模式`);
        errorPatternsFound++;
      }
    });

    if (errorPatternsFound === 0) {
      console.log('   ✅ 未发现明显的错误模式');
    }

    // 页面结构完整性检查
    console.log('\n🏗️ 页面结构完整性:');

    const hasHtml = document.documentElement;
    const hasHead = document.querySelector('head');
    const hasBody = document.querySelector('body');
    const hasTitle = document.querySelector('title');

    console.log(`   HTML元素: ${hasHtml ? '✅' : '❌'}`);
    console.log(`   HEAD元素: ${hasHead ? '✅' : '❌'}`);
    console.log(`   BODY元素: ${hasBody ? '✅' : '❌'}`);
    console.log(`   TITLE元素: ${hasTitle ? '✅' : '❌'}`);

    // 综合诊断
    console.log('\n🎯 综合诊断结果:');

    const isGalleryPage = hasGalleryTitle && hasGalleryComponent;
    const hasErrors = errorCount > 0 || errorPatternsFound > 0;
    const hasReactApp = reactRoots.length > 0 || hasReactScripts;

    console.log(`   Gallery页面: ${isGalleryPage ? '✅' : '❌'}`);
    console.log(`   React应用: ${hasReactApp ? '✅' : '❌'}`);
    console.log(`   错误状态: ${hasErrors ? '❌' : '✅'}`);

    if (isGalleryPage && !hasErrors) {
      console.log('\n🎉 Gallery页面状态良好！');
    } else if (isGalleryPage && hasErrors) {
      console.log('\n⚠️ Gallery页面正在加载但存在错误');
      console.log('   💡 建议检查浏览器控制台获取详细错误信息');
    } else {
      console.log('\n❌ Gallery页面存在问题');
    }

    // 提供具体建议
    console.log('\n💡 建议操作:');

    if (!hasReactApp) {
      console.log('   1. 检查React应用是否正确初始化');
      console.log('   2. 确认Next.js构建是否成功');
    }

    if (hasErrors) {
      console.log('   3. 在浏览器中打开开发者工具');
      console.log('   4. 检查Console面板的JavaScript错误');
      console.log('   5. 检查Network面板的加载失败');
    }

    if (!isGalleryPage) {
      console.log('   6. 确认路由配置是否正确');
      console.log('   7. 检查Gallery页面文件是否存在');
    }

  } catch (error) {
    console.error('❌ 页面分析失败:', error.message);
    console.error('   错误堆栈:', error.stack);
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

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

// 运行分析
analyzeGalleryPage().catch(error => {
  console.error('💥 分析执行失败:', error.message);
  process.exit(1);
});