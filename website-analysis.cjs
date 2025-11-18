const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

// 网站技术审查工具
class WebsiteAudit {
  constructor(targetUrl) {
    this.targetUrl = targetUrl;
    this.results = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      basicInfo: {},
      performance: {},
      structure: {},
      security: {},
      seo: {},
      resources: [],
      recommendations: []
    };
  }

  async fetchUrl(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;

      const req = protocol.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.on('error', reject);
    });
  }

  async analyzeBasicInfo(html, headers) {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i);
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["'](.*?)["'][^>]*>/i);
    const charsetMatch = html.match(/<meta[^>]*charset=["'](.*?)["'][^>]*>/i);
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["'](.*?)["'][^>]*>/i);

    // 检测技术栈
    let technology = {
      cms: 'Unknown',
      framework: [],
      libraries: []
    };

    // WordPress检测
    if (html.includes('wp-content') || html.includes('wp-includes')) {
      technology.cms = 'WordPress';
    }

    // jQuery检测
    if (html.includes('jquery')) {
      technology.libraries.push('jQuery');
    }

    // Bootstrap检测
    if (html.includes('bootstrap')) {
      technology.framework.push('Bootstrap');
    }

    // Font Awesome检测
    if (html.includes('font-awesome') || html.includes('fa ')) {
      technology.libraries.push('Font Awesome');
    }

    // WOW动画库检测
    if (html.includes('wow')) {
      technology.libraries.push('WOW.js');
    }

    this.results.basicInfo = {
      title: titleMatch ? titleMatch[1] : 'N/A',
      description: descriptionMatch ? descriptionMatch[1] : 'N/A',
      keywords: keywordsMatch ? keywordsMatch[1] : 'N/A',
      charset: charsetMatch ? charsetMatch[1] : 'N/A',
      viewport: viewportMatch ? viewportMatch[1] : 'N/A',
      server: headers.server || 'N/A',
      technology
    };
  }

  analyzeStructure(html) {
    const structure = {
      doctype: html.includes('<!DOCTYPE html>') ? 'HTML5' : 'Unknown',
      html5Semantic: {
        header: (html.match(/<header/g) || []).length,
        nav: (html.match(/<nav/g) || []).length,
        main: (html.match(/<main/g) || []).length,
        section: (html.match(/<section/g) || []).length,
        article: (html.match(/<article/g) || []).length,
        aside: (html.match(/<aside/g) || []).length,
        footer: (html.match(/<footer/g) || []).length
      },
      images: {
        total: (html.match(/<img/g) || []).length,
        withAlt: (html.match(/<img[^>]*alt=/g) || []).length,
        withoutAlt: 0
      },
      links: {
        total: (html.match(/<a/g) || []).length,
        internal: 0,
        external: 0
      },
      headings: {
        h1: (html.match(/<h1/g) || []).length,
        h2: (html.match(/<h2/g) || []).length,
        h3: (html.match(/<h3/g) || []).length,
        h4: (html.match(/<h4/g) || []).length,
        h5: (html.match(/<h5/g) || []).length,
        h6: (html.match(/<h6/g) || []).length
      },
      forms: (html.match(/<form/g) || []).length,
      scripts: (html.match(/<script/g) || []).length,
      stylesheets: (html.match(/<link[^>]*rel=["']stylesheet["']/g) || []).length
    };

    // 计算没有alt属性的图片数量
    structure.images.withoutAlt = structure.images.total - structure.images.withAlt;

    // 分析链接类型
    const allLinks = html.match(/<a[^>]*href=["'](.*?)["'][^>]*>/g) || [];
    allLinks.forEach(link => {
      const hrefMatch = link.match(/href=["'](.*?)["']/);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (href.startsWith('http')) {
          structure.links.external++;
        } else {
          structure.links.internal++;
        }
      }
    });

    this.results.structure = structure;
  }

  analyzeSEO(html) {
    const seo = {
      title: {
        present: html.includes('<title>'),
        length: 0,
        optimized: false
      },
      metaDescription: {
        present: html.includes('name="description"'),
        length: 0,
        optimized: false
      },
      headings: {
        hasH1: (html.match(/<h1/g) || []).length === 1,
        h1Count: (html.match(/<h1/g) || []).length
      },
      images: {
        total: (html.match(/<img/g) || []).length,
        withAlt: (html.match(/<img[^>]*alt=/g) || []).length
      },
      language: html.includes('lang=') ? html.match(/lang=["'](.*?)["']/)[1] : 'Not declared',
      canonical: html.includes('rel="canonical"'),
      openGraph: {
        title: html.includes('property="og:title"'),
        description: html.includes('property="og:description"'),
        image: html.includes('property="og:image"')
      },
      twitterCard: {
        card: html.includes('name="twitter:card"'),
        title: html.includes('name="twitter:title"'),
        description: html.includes('name="twitter:description"'),
        image: html.includes('name="twitter:image"')
      },
      structuredData: html.includes('application/ld+json')
    };

    // 计算标题和描述长度
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      seo.title.length = titleMatch[1].length;
      seo.title.optimized = titleMatch[1].length >= 30 && titleMatch[1].length <= 60;
    }

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i);
    if (descMatch) {
      seo.metaDescription.length = descMatch[1].length;
      seo.metaDescription.optimized = descMatch[1].length >= 120 && descMatch[1].length <= 160;
    }

    this.results.seo = seo;
  }

  analyzeSecurity(html, headers) {
    const security = {
      https: this.targetUrl.startsWith('https'),
      headers: {
        'X-Frame-Options': headers['x-frame-options'] || 'Not Set',
        'X-XSS-Protection': headers['x-xss-protection'] || 'Not Set',
        'X-Content-Type-Options': headers['x-content-type-options'] || 'Not Set',
        'Strict-Transport-Security': headers['strict-transport-security'] || 'Not Set',
        'Content-Security-Policy': headers['content-security-policy'] || 'Not Set'
      },
      mixedContent: false,
      formsSecure: true,
      hasCSRF: false
    };

    // 检查混合内容
    if (security.https) {
      const httpResources = html.match(/http:\/\//g) || [];
      security.mixedContent = httpResources.length > 0;
    }

    // 检查表单安全性
    const forms = html.match(/<form[^>]*>/g) || [];
    forms.forEach(form => {
      if (form.includes('action="http://')) {
        security.formsSecure = false;
      }
    });

    // 检查CSRF令牌
    security.hasCSRF = html.includes('csrf') || html.includes('token');

    this.results.security = security;
  }

  extractResources(html) {
    const resources = [];

    // 提取CSS文件
    const cssMatches = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*href=["'](.*?)["'][^>]*>/g) || [];
    cssMatches.forEach(match => {
      const hrefMatch = match.match(/href=["'](.*?)["']/);
      if (hrefMatch) {
        resources.push({
          type: 'css',
          url: hrefMatch[1],
          inline: false
        });
      }
    });

    // 提取JavaScript文件
    const jsMatches = html.match(/<script[^>]*src=["'](.*?)["'][^>]*>/g) || [];
    jsMatches.forEach(match => {
      const srcMatch = match.match(/src=["'](.*?)["']/);
      if (srcMatch) {
        resources.push({
          type: 'javascript',
          url: srcMatch[1],
          inline: false
        });
      }
    });

    // 提取图片
    const imgMatches = html.match(/<img[^>]*src=["'](.*?)["'][^>]*>/g) || [];
    imgMatches.forEach(match => {
      const srcMatch = match.match(/src=["'](.*?)["']/);
      if (srcMatch) {
        resources.push({
          type: 'image',
          url: srcMatch[1],
          inline: false
        });
      }
    });

    // 提取内联样式
    const inlineStyles = html.match(/<style[^>]*>(.*?)<\/style>/gs) || [];
    inlineStyles.forEach((style, index) => {
      resources.push({
        type: 'css',
        content: style,
        inline: true,
        size: style.length
      });
    });

    // 提取内联脚本
    const inlineScripts = html.match(/<script[^>]*>(.*?)<\/script>/gs) || [];
    inlineScripts.forEach((script, index) => {
      resources.push({
        type: 'javascript',
        content: script,
        inline: true,
        size: script.length
      });
    });

    this.results.resources = resources;
  }

  generateRecommendations() {
    const recommendations = [];
    const { basicInfo, structure, seo, security, resources } = this.results;

    // SEO建议
    if (!seo.title.present) {
      recommendations.push({
        category: 'SEO',
        priority: 'High',
        issue: 'Missing page title',
        recommendation: 'Add a descriptive title tag to every page'
      });
    }

    if (!seo.metaDescription.present) {
      recommendations.push({
        category: 'SEO',
        priority: 'High',
        issue: 'Missing meta description',
        recommendation: 'Add a compelling meta description (150-160 characters)'
      });
    }

    if (seo.headings.h1Count !== 1) {
      recommendations.push({
        category: 'SEO',
        priority: 'Medium',
        issue: `Page has ${seo.headings.h1Count} H1 tags (should be exactly 1)`,
        recommendation: 'Use exactly one H1 tag per page for better SEO'
      });
    }

    // 性能建议
    const jsResources = resources.filter(r => r.type === 'javascript' && !r.inline);
    const cssResources = resources.filter(r => r.type === 'css' && !r.inline);

    if (jsResources.length > 5) {
      recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: `Page loads ${jsResources.length} external JavaScript files`,
        recommendation: 'Consider combining JavaScript files to reduce HTTP requests'
      });
    }

    if (cssResources.length > 3) {
      recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: `Page loads ${cssResources.length} external CSS files`,
        recommendation: 'Consider combining CSS files to reduce HTTP requests'
      });
    }

    // 可访问性建议
    if (structure.images.withoutAlt > 0) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'High',
        issue: `${structure.images.withoutAlt} images without alt attributes`,
        recommendation: 'Add descriptive alt attributes to all images for accessibility'
      });
    }

    // 安全建议
    if (!security.https) {
      recommendations.push({
        category: 'Security',
        priority: 'High',
        issue: 'Website does not use HTTPS',
        recommendation: 'Implement SSL/TLS to secure the website'
      });
    }

    if (security.mixedContent) {
      recommendations.push({
        category: 'Security',
        priority: 'High',
        issue: 'Mixed content detected (HTTPS page loading HTTP resources)',
        recommendation: 'Update all resource URLs to use HTTPS'
      });
    }

    // 技术栈建议
    if (basicInfo.technology.cms === 'WordPress') {
      recommendations.push({
        category: 'Technology',
        priority: 'Low',
        issue: 'Using WordPress CMS',
        recommendation: 'Keep WordPress, themes, and plugins updated for security'
      });
    }

    this.results.recommendations = recommendations;
  }

  async run() {
    try {
      console.log(`🔍 开始技术审查: ${this.targetUrl}`);

      const startTime = Date.now();
      const response = await this.fetchUrl(this.targetUrl);
      const loadTime = Date.now() - startTime;

      console.log(`✅ 页面加载完成，耗时: ${loadTime}ms`);

      // 执行各项分析
      await this.analyzeBasicInfo(response.data, response.headers);
      this.analyzeStructure(response.data);
      this.analyzeSEO(response.data);
      this.analyzeSecurity(response.data, response.headers);
      this.extractResources(response.data);
      this.generateRecommendations();

      // 添加性能数据
      this.results.performance = {
        loadTime,
        resourceCount: this.results.resources.length,
        totalSize: response.data.length
      };

      console.log('📊 技术审查完成！');
      return this.results;

    } catch (error) {
      console.error('❌ 审查过程中出现错误:', error.message);
      throw error;
    }
  }

  saveReport(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.results, null, 2));
    console.log(`📄 报告已保存到: ${filePath}`);
  }

  printSummary() {
    const { basicInfo, performance, structure, seo, security, recommendations } = this.results;

    console.log('\n=== 网站技术审查报告 ===');
    console.log(`🌐 URL: ${this.targetUrl}`);
    console.log(`⏰ 审查时间: ${this.results.timestamp}`);

    console.log('\n📋 基本信息:');
    console.log(`  标题: ${basicInfo.title}`);
    console.log(`  CMS: ${basicInfo.technology.cms}`);
    console.log(`  框架: ${basicInfo.technology.framework.join(', ') || 'None'}`);
    console.log(`  库: ${basicInfo.technology.libraries.join(', ') || 'None'}`);

    console.log('\n⚡ 性能:');
    console.log(`  加载时间: ${performance.loadTime}ms`);
    console.log(`  资源数量: ${performance.resourceCount}`);
    console.log(`  页面大小: ${(performance.totalSize / 1024).toFixed(2)} KB`);

    console.log('\n🏗️ 结构:');
    console.log(`  DOCTYPE: ${structure.doctype}`);
    console.log(`  图片: ${structure.images.total} (${structure.images.withoutAlt} 缺少alt)`);
    console.log(`  链接: ${structure.links.total} (${structure.links.internal} 内部, ${structure.links.external} 外部)`);
    console.log(`  表单: ${structure.forms}`);

    console.log('\n🔍 SEO:');
    console.log(`  标题: ${seo.title.present ? '✅' : '❌'} (${seo.title.length} 字符)`);
    console.log(`  描述: ${seo.metaDescription.present ? '✅' : '❌'} (${seo.metaDescription.length} 字符)`);
    console.log(`  H1标签: ${seo.headings.hasH1 ? '✅' : '❌'} (${seo.headings.h1Count} 个)`);
    console.log(`  语言: ${seo.language}`);

    console.log('\n🔒 安全:');
    console.log(`  HTTPS: ${security.https ? '✅' : '❌'}`);
    console.log(`  混合内容: ${security.mixedContent ? '❌' : '✅'}`);
    console.log(`  表单安全: ${security.formsSecure ? '✅' : '❌'}`);

    console.log('\n💡 建议:');
    if (recommendations.length === 0) {
      console.log('  无建议 - 网站状态良好！');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. [${rec.category}] ${rec.issue}`);
        console.log(`     建议: ${rec.recommendation}\n`);
      });
    }
  }
}

// 运行审查
async function main() {
  const auditor = new WebsiteAudit('http://www.dingjipower.com/');

  try {
    await auditor.run();
    auditor.printSummary();
    auditor.saveReport('/home/saken/project/Xorigo-UI/dingjipower-audit-report.json');
  } catch (error) {
    console.error('审查失败:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = WebsiteAudit;