const https = require('https');
const http = require('http');
const { JSDOM } = require('jsdom');

async function analyzeGalleryContent() {
  console.log('🔍 深度分析Gallery页面内容...\n');

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

    // 检查页面是否是客户端渲染
    console.log('🔧 渲染模式检查:');
    const rootElement = document.querySelector('#root, #__next, [id*="app"]');
    if (rootElement) {
      console.log(`   ✅ 发现React根元素: ${rootElement.id || rootElement.tagName}`);
      console.log(`   根元素内容: ${rootElement.innerHTML.substring(0, 200)}...`);
    } else {
      console.log('   ❌ 未发现React根元素');
    }

    // 检查Loading状态
    console.log('\n⏳ Loading状态检查:');
    const loadingIndicators = [
      '.loading', '.spinner', '.skeleton',
      '[data-loading]', '[data-state="loading"]'
    ];

    let loadingFound = false;
    loadingIndicators.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`   ⏳ 发现 ${elements.length} 个Loading元素: ${selector}`);
        loadingFound = true;
      }
    });

    if (!loadingFound) {
      console.log('   ✅ 未发现Loading元素');
    }

    // 检查是否有占位符内容
    console.log('\n📄 占位符内容检查:');
    const bodyText = document.body?.textContent || '';
    if (bodyText.trim().length < 100) {
      console.log('   ⚠️ 页面body内容很少，可能是CSR渲染中');
      console.log(`   Body内容: "${bodyText.substring(0, 100)}"`);
    } else {
      console.log(`   ✅ Body有实际内容: ${bodyText.length} 字符`);
    }

    // 检查关键脚本文件
    console.log('\n📦 关键脚本检查:');
    const scripts = document.querySelectorAll('script[src]');
    const relevantScripts = [];

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && (src.includes('chunk') || src.includes('vendor') || src.includes('main'))) {
        relevantScripts.push(src);
      }
    });

    console.log(`   相关脚本文件: ${relevantScripts.length} 个`);
    relevantScripts.slice(0, 5).forEach((src, index) => {
      console.log(`     ${index + 1}. ${src}`);
    });

    // 检查内联脚本内容
    console.log('\n🔍 内联脚本分析:');
    const inlineScripts = document.querySelectorAll('script:not([src])');
    let hasReactCode = false;
    let hasComponentCode = false;
    let hasGalleryCode = false;

    inlineScripts.forEach((script, index) => {
      const content = script.textContent || '';
      if (content.includes('React') || content.includes('useState') || content.includes('useEffect')) {
        hasReactCode = true;
      }
      if (content.includes('Gallery') || content.includes('Card') || content.includes('Button')) {
        hasComponentCode = true;
      }
      if (content.includes('gallery') || content.includes('Gallery')) {
        hasGalleryCode = true;
      }
    });

    console.log(`   包含React代码: ${hasReactCode ? '✅' : '❌'}`);
    console.log(`   包含组件代码: ${hasComponentCode ? '✅' : '❌'}`);
    console.log(`   包含Gallery代码: ${hasGalleryCode ? '✅' : '❌'}`);

    // 检查错误边界
    console.log('\n🛡️ 错误边界检查:');
    const errorBoundarySelectors = [
      '[data-testid="error-boundary"]',
      '.error-boundary',
      '.error-fallback',
      '[data-fallback]'
    ];

    let hasErrorBoundary = false;
    errorBoundarySelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`   ✅ 发现错误边界: ${selector} (${elements.length}个)`);
        hasErrorBoundary = true;
      }
    });

    if (!hasErrorBoundary) {
      console.log('   ⚠️ 未发现明显的错误边界');
    }

    // 检查meta标签
    console.log('\n🏷️ Meta标签检查:');
    const metaTags = document.querySelectorAll('meta');
    console.log(`   Meta标签总数: ${metaTags.length}`);

    const importantMetas = [
      'charset', 'viewport', 'description', 'keywords', 'author'
    ];

    importantMetas.forEach(name => {
      const meta = name === 'charset'
        ? document.querySelector('meta[charset]')
        : document.querySelector(`meta[name="${name}"]`);
      console.log(`   ${name}: ${meta ? '✅' : '❌'}`);
    });

    // 检查CSS加载状态
    console.log('\n🎨 CSS状态检查:');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    console.log(`   外部样式表: ${stylesheets.length} 个`);

    let cssLoaded = 0;
    stylesheets.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('data:')) {
        cssLoaded++;
      }
    });

    console.log(`   CSS文件链接: ${cssLoaded} 个`);

    // 检查可能的JavaScript错误模式（更细粒度）
    console.log('\n🐛 细粒度错误检查:');
    const detailedErrorPatterns = [
      { name: 'TypeError', pattern: /TypeError/i },
      { name: 'ReferenceError', pattern: /ReferenceError/i },
      { name: 'Cannot read property', pattern: /Cannot read propert(y|ies)/i },
      { name: 'undefined is not', pattern: /undefined is not/i },
      { name: 'null is not', pattern: /null is not/i },
      { name: 'Module not found', pattern: /Module not found/i },
      { name: 'Failed to fetch', pattern: /Failed to fetch/i }
    ];

    let errorsFound = 0;
    detailedErrorPatterns.forEach(({ name, pattern }) => {
      if (pattern.test(htmlContent)) {
        console.log(`   ❌ 发现${name}模式`);
        errorsFound++;
      }
    });

    if (errorsFound === 0) {
      console.log('   ✅ 未发现JavaScript错误模式');
    }

    // 检查React相关的警告模式
    console.log('\n⚛️ React警告检查:');
    const reactWarningPatterns = [
      /Warning:.*key prop/i,
      /Warning:.*failed/i,
      /Warning:.*deprecated/i,
      /Warning: Each child in a list should have a unique "key" prop/i
    ];

    let reactWarningsFound = 0;
    reactWarningPatterns.forEach(pattern => {
      if (pattern.test(htmlContent)) {
        console.log(`   ⚠️ 发现React警告模式`);
        reactWarningsFound++;
      }
    });

    if (reactWarningsFound === 0) {
      console.log('   ✅ 未发现React警告模式');
    }

    // 综合判断
    console.log('\n🎯 综合分析结果:');

    const hasRoot = !!rootElement;
    const hasMinimalContent = bodyText.trim().length < 100;
    const hasManyScripts = inlineScripts.length > 50;
    const hasNoVisibleComponents = true; // 从之前的分析可知

    console.log(`   React根元素: ${hasRoot ? '✅' : '❌'}`);
    console.log(`   内容稀少: ${hasMinimalContent ? '⚠️' : '✅'}`);
    console.log(`   脚本数量多: ${hasManyScripts ? '⚠️' : '✅'}`);
    console.log(`   无可见组件: ${hasNoVisibleComponents ? '⚠️' : '✅'}`);

    if (hasRoot && hasMinimalContent && hasManyScripts) {
      console.log('\n💡 诊断结果: 这是一个典型的客户端渲染(CSR)应用');
      console.log('   📝 页面正在等待JavaScript执行来渲染组件');
      console.log('   🔧 建议使用支持JavaScript渲染的工具(如Puppeteer/Playwright)进行完整检查');
      console.log('   ⏳ 或者等待更长时间让JavaScript执行完成');
    } else if (!hasRoot && hasMinimalContent) {
      console.log('\n⚠️ 诊断结果: 页面可能存在渲染问题');
      console.log('   🔧 建议检查React应用是否正确挂载');
    } else {
      console.log('\n✅ 诊断结果: 页面结构正常');
    }

    // 提供具体的修复建议
    if (hasRoot && hasMinimalContent) {
      console.log('\n🔧 建议的下一步行动:');
      console.log('   1. 检查JavaScript控制台是否有错误');
      console.log('   2. 验证所有脚本文件是否正确加载');
      console.log('   3. 确认React应用是否正确初始化');
      console.log('   4. 检查网络请求是否成功');
      console.log('   5. 尝试使用浏览器开发者工具查看实时渲染状态');
    }

  } catch (error) {
    console.error('❌ 页面分析失败:', error.message);
  }
}

function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

// 运行分析
analyzeGalleryContent().catch(error => {
  console.error('💥 分析执行失败:', error.message);
  process.exit(1);
});