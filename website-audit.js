const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('开始对 http://www.dingjipower.com/ 进行全面技术审查...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  // 监听网络请求
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      type: request.resourceType(),
      startTime: Date.now()
    });
  });

  // 监听控制台消息
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // 监听页面错误
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
  });

  try {
    console.log('1. 正在访问网站...');
    const startTime = Date.now();

    // 等待页面完全加载
    await page.goto('http://www.dingjipower.com/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const loadTime = Date.now() - startTime;
    console.log(`页面加载完成，耗时: ${loadTime}ms`);

    // 获取页面基本信息
    const title = await page.title();
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content') ||
                           await page.getAttribute('meta[property="og:description"]', 'content');

    console.log('2. 正在截图...');
    await page.screenshot({
      path: '/home/saken/project/Xorigo-UI/dingjipower-screenshot.png',
      fullPage: true
    });

    // 获取性能指标
    console.log('3. 正在收集性能指标...');
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
      };
    });

    // 分析页面结构
    console.log('4. 正在分析页面结构...');
    const pageStructure = await page.evaluate(() => {
      const stats = {
        totalElements: document.querySelectorAll('*').length,
        headings: {
          h1: document.querySelectorAll('h1').length,
          h2: document.querySelectorAll('h2').length,
          h3: document.querySelectorAll('h3').length
        },
        images: document.querySelectorAll('img').length,
        imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
        links: document.querySelectorAll('a').length,
        forms: document.querySelectorAll('form').length,
        scripts: document.querySelectorAll('script').length,
        stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
        hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
        hasLangAttr: !!document.documentElement.lang
      };

      // 检测使用的框架和库
      const frameworks = [];
      if (window.jQuery) frameworks.push('jQuery');
      if (window.React) frameworks.push('React');
      if (window.Vue) frameworks.push('Vue');
      if (window.angular) frameworks.push('Angular');
      if (document.querySelector('.bootstrap')) frameworks.push('Bootstrap');

      // 检查SEO元素
      const seo = {
        hasTitle: !!document.title,
        titleLength: document.title.length,
        hasMetaDescription: !!document.querySelector('meta[name="description"]'),
        hasH1: document.querySelectorAll('h1').length > 0,
        hasCanonical: !!document.querySelector('link[rel="canonical"]'),
        hasOpenGraph: !!document.querySelector('meta[property^="og:"]'),
        hasTwitterCard: !!document.querySelector('meta[name^="twitter:"]')
      };

      // 检查可访问性
      const accessibility = {
        hasLangAttr: !!document.documentElement.lang,
        imagesWithAlt: document.querySelectorAll('img[alt]').length,
        totalImages: document.querySelectorAll('img').length,
        hasAriaLabels: document.querySelectorAll('[aria-label]').length,
        hasSkipLinks: document.querySelectorAll('a[href^="#"]').length
      };

      return { stats, frameworks, seo, accessibility };
    });

    // 获取Core Web Vitals
    console.log('5. 正在获取Core Web Vitals...');

    // 先等待一段时间收集性能数据
    await page.waitForTimeout(3000);

    const webVitals = await page.evaluate(() => {
      const vitals = {};

      // 获取LCP (Largest Contentful Paint)
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        vitals.LCP = Math.round(lcpEntries[lcpEntries.length - 1].renderTime || lcpEntries[lcpEntries.length - 1].loadTime);
      }

      // 获取FID (First Input Delay) - 需要用户交互，这里使用首次绘制作为替代
      const paintEntries = performance.getEntriesByType('paint');
      if (paintEntries.length >= 2) {
        vitals.FCP = Math.round(paintEntries[1].startTime);
      }

      // 获取CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsEntries = performance.getEntriesByType('layout-shift');
      clsEntries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      vitals.CLS = Math.round(clsValue * 1000) / 1000;

      return vitals;
    });

    // 获取资源加载信息
    console.log('6. 正在分析资源加载...');
    const resourceAnalysis = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const analysis = {
        total: resources.length,
        byType: {},
        totalSize: 0,
        slowResources: [],
        cachedResources: 0
      };

      resources.forEach(resource => {
        const type = resource.initiatorType;
        analysis.byType[type] = (analysis.byType[type] || 0) + 1;

        if (resource.duration > 1000) {
          analysis.slowResources.push({
            name: resource.name,
            duration: Math.round(resource.duration),
            type: type
          });
        }

        // 检查缓存
        if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
          analysis.cachedResources++;
        }

        // 估算文件大小
        if (resource.transferSize) {
          analysis.totalSize += resource.transferSize;
        }
      });

      return analysis;
    });

    // 响应式设计测试
    console.log('7. 正在进行响应式设计测试...');

    // 测试移动端视图
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: '/home/saken/project/Xorigo-UI/dingjipower-mobile.png',
      fullPage: true
    });

    const mobileLayout = await page.evaluate(() => {
      return {
        hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
        isTextReadable: window.getComputedStyle(document.body).fontSize !== '0px',
        viewportWidth: window.innerWidth,
        contentWidth: document.body.scrollWidth
      };
    });

    // 测试平板视图
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: '/home/saken/project/Xorigo-UI/dingjipower-tablet.png',
      fullPage: true
    });

    // 恢复桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 安全性检查
    console.log('8. 正在进行安全性检查...');
    const securityAnalysis = await page.evaluate(() => {
      const security = {
        isHTTPS: location.protocol === 'https:',
        hasMixedContent: false,
        securityHeaders: {},
        formSecurity: {
          hasCSRF: false,
          hasInputValidation: false
        }
      };

      // 检查混合内容
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        if (element.src && element.src.startsWith('http://')) {
          security.hasMixedContent = true;
        }
        if (element.href && element.href.startsWith('http://')) {
          security.hasMixedContent = true;
        }
      });

      return security;
    });

    // 汇总结果
    const auditResults = {
      url: 'http://www.dingjipower.com/',
      timestamp: new Date().toISOString(),
      basicInfo: {
        title,
        metaDescription,
        loadTime
      },
      performance: {
        metrics: performanceMetrics,
        webVitals,
        resources: resourceAnalysis
      },
      structure: pageStructure,
      responsive: {
        mobile: mobileLayout,
        testedViewports: ['375x667', '768x1024', '1920x1080']
      },
      security: securityAnalysis,
      network: {
        requests: networkRequests.length,
        errors: pageErrors.length,
        consoleMessages: consoleMessages.filter(msg => msg.type === 'error' || msg.type === 'warning')
      },
      screenshots: {
        desktop: '/home/saken/project/Xorigo-UI/dingjipower-screenshot.png',
        mobile: '/home/saken/project/Xorigo-UI/dingjipower-mobile.png',
        tablet: '/home/saken/project/Xorigo-UI/dingjipower-tablet.png'
      }
    };

    // 保存完整报告
    fs.writeFileSync(
      '/home/saken/project/Xorigo-UI/dingjipower-audit-report.json',
      JSON.stringify(auditResults, null, 2)
    );

    console.log('=== 技术审查完成 ===');
    console.log(`标题: ${title}`);
    console.log(`加载时间: ${loadTime}ms`);
    console.log(`网络请求: ${networkRequests.length}个`);
    console.log(`控制台错误: ${pageErrors.length}个`);
    console.log('报告已保存到: /home/saken/project/Xorigo-UI/dingjipower-audit-report.json');
    console.log('截图已保存到: /home/saken/project/Xorigo-UI/dingjipower-screenshot.png');

  } catch (error) {
    console.error('审查过程中出现错误:', error);
  } finally {
    await browser.close();
  }
})();