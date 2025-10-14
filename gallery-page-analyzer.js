const https = require('https');
const http = require('http');
const { JSDOM } = require('jsdom');

async function analyzeGalleryPage() {
  console.log('🔍 开始分析Gallery页面...\n');

  const url = 'http://localhost:3100/gallery';

  try {
    // 获取页面内容
    console.log('📡 获取页面内容...');
    const htmlContent = await fetchPageContent(url);

    if (!htmlContent) {
      console.error('❌ 无法获取页面内容');
      return;
    }

    console.log(`✅ 页面内容获取成功 (${htmlContent.length} bytes)\n`);

    // 使用JSDOM解析HTML
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // 基础页面信息
    console.log('📄 页面基础信息:');
    const title = document.querySelector('title');
    console.log(`   标题: ${title ? title.textContent : '未找到'}`);

    const description = document.querySelector('meta[name="description"]');
    console.log(`   描述: ${description ? description.getAttribute('content') : '未找到'}`);

    const lang = document.documentElement.getAttribute('lang');
    console.log(`   语言: ${lang || '未设置'}`);

    // 检查错误元素
    console.log('\n🚨 错误检查:');
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

    if (errorCount === 0) {
      console.log('   ✅ 未发现明显的错误元素');
    }

    // 检查Gallery组件
    console.log('\n🧩 组件检查:');
    const componentChecks = [
      { name: 'Gallery组件', selector: '[class*="gallery"], [class*="Gallery"]' },
      { name: 'Card组件', selector: '[class*="card"], [class*="Card"]' },
      { name: 'Button组件', selector: 'button, [role="button"], [class*="button"], [class*="Button"]' },
      { name: '导航组件', selector: 'nav, [role="navigation"], [class*="nav"], [class*="Nav"]' },
      { name: '链接元素', selector: 'a[href]' },
      { name: '图片元素', selector: 'img' },
      { name: '脚本元素', selector: 'script' }
    ];

    componentChecks.forEach(({ name, selector }) => {
      const elements = document.querySelectorAll(selector);
      console.log(`   ${name}: ${elements.length} 个`);

      // 显示前几个元素的详细信息
      if (elements.length > 0 && elements.length <= 5) {
        Array.from(elements).slice(0, 3).forEach((el, index) => {
          const text = el.textContent?.trim().substring(0, 30);
          const className = el.className || '';
          console.log(`      ${index + 1}. ${text || className || el.tagName}`);
        });
      } else if (elements.length > 5) {
        console.log(`      (显示前3个)`);
        Array.from(elements).slice(0, 3).forEach((el, index) => {
          const text = el.textContent?.trim().substring(0, 30);
          const className = el.className || '';
          console.log(`      ${index + 1}. ${text || className || el.tagName}`);
        });
      }
    });

    // 检查JavaScript错误相关的模式
    console.log('\n🐛 JavaScript检查:');
    const jsErrorPatterns = [
      /Cannot read propert(y|ies)/,
      /undefined is not/,
      /null is not/,
      /TypeError:/,
      /ReferenceError:/,
      /SyntaxError:/,
      /Error:/
    ];

    let jsErrorsFound = 0;
    jsErrorPatterns.forEach(pattern => {
      if (pattern.test(htmlContent)) {
        console.log(`   ❌ 发现JavaScript错误模式: ${pattern.source}`);
        jsErrorsFound++;
      }
    });

    if (jsErrorsFound === 0) {
      console.log('   ✅ 未发现明显的JavaScript错误模式');
    }

    // 检查CSS和样式问题
    console.log('\n🎨 CSS检查:');
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    console.log(`   样式表: ${styleSheets.length} 个`);

    const inlineStyles = document.querySelectorAll('style');
    console.log(`   内联样式: ${inlineStyles.length} 个`);

    // 检查内联脚本
    const inlineScripts = document.querySelectorAll('script:not([src])');
    console.log(`   内联脚本: ${inlineScripts.length} 个`);

    // 检查外部脚本
    const externalScripts = document.querySelectorAll('script[src]');
    console.log(`   外部脚本: ${externalScripts.length} 个`);

    // 检查性能相关问题
    console.log('\n⚡ 性能检查:');
    const largeElements = document.querySelectorAll('[style*="background-image"], img[src]');
    if (largeElements.length > 10) {
      console.log(`   ⚠️ 可能的性能问题: ${largeElements.length} 个带图片的元素`);
    } else {
      console.log(`   ✅ 图片元素数量合理: ${largeElements.length} 个`);
    }

    // 检查可访问性
    console.log('\n♿ 可访问性检查:');
    const altImages = document.querySelectorAll('img[alt]');
    const totalImages = document.querySelectorAll('img');
    if (totalImages.length > 0) {
      console.log(`   带alt属性的图片: ${altImages.length}/${totalImages.length}`);
    }

    const buttonsWithText = document.querySelectorAll('button').length;
    const linksWithText = document.querySelectorAll('a[href]').length;
    console.log(`   按钮元素: ${buttonsWithText} 个`);
    console.log(`   链接元素: ${linksWithText} 个`);

    // 检查HTML结构完整性
    console.log('\n🏗️ HTML结构检查:');
    const hasHtml = document.documentElement;
    const hasHead = document.querySelector('head');
    const hasBody = document.querySelector('body');
    const hasViewport = document.querySelector('meta[name="viewport"]');

    console.log(`   HTML元素: ${hasHtml ? '✅' : '❌'}`);
    console.log(`   HEAD元素: ${hasHead ? '✅' : '❌'}`);
    console.log(`   BODY元素: ${hasBody ? '✅' : '❌'}`);
    console.log(`   Viewport meta: ${hasViewport ? '✅' : '❌'}`);

    // 检查React相关的错误模式
    console.log('\n⚛️ React检查:');
    const reactErrorPatterns = [
      /Minified React error/,
      /Error: Minified React error/,
      /TypeError: Cannot read propert.*props/,
      /Invariant Violation/,
      /Warning:.*failed/
    ];

    let reactErrorsFound = 0;
    reactErrorPatterns.forEach(pattern => {
      if (pattern.test(htmlContent)) {
        console.log(`   ❌ 发现React错误模式: ${pattern.source}`);
        reactErrorsFound++;
      }
    });

    if (reactErrorsFound === 0) {
      console.log('   ✅ 未发现明显的React错误模式');
    }

    // 总结
    console.log('\n🎯 分析总结:');
    console.log(`   📄 页面大小: ${htmlContent.length} bytes`);
    console.log(`   🚨 错误元素: ${errorCount} 个`);
    console.log(`   🐛 JS错误模式: ${jsErrorsFound} 个`);
    console.log(`   ⚛️ React错误: ${reactErrorsFound} 个`);

    if (errorCount === 0 && jsErrorsFound === 0 && reactErrorsFound === 0) {
      console.log('\n🎉 Gallery页面分析完全通过！页面结构良好，未发现明显问题。');
    } else {
      console.log('\n⚠️ Gallery页面存在一些潜在问题，建议进一步检查。');

      if (errorCount > 0) console.log(`   - 发现 ${errorCount} 个错误元素`);
      if (jsErrorsFound > 0) console.log(`   - 发现 ${jsErrorsFound} 个JavaScript错误模式`);
      if (reactErrorsFound > 0) console.log(`   - 发现 ${reactErrorsFound} 个React错误模式`);
    }

  } catch (error) {
    console.error('❌ 页面分析失败:', error.message);
  }
}

function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, (res) => {
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

    req.setTimeout(30000, () => {
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