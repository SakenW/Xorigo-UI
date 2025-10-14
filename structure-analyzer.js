const https = require('https');
const http = require('http');
const fs = require('fs');

async function analyzePageStructure() {
  console.log('🏗️ 分析Gallery页面HTML结构...\n');

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

    // 保存原始HTML到文件用于分析
    fs.writeFileSync('/tmp/gallery-content.html', htmlContent);
    console.log('📁 页面内容已保存到 /tmp/gallery-content.html');

    // 分析body内容的前2000个字符
    console.log('📄 Body内容分析:');
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const bodyContent = bodyMatch[1];
      console.log(`   Body总长度: ${bodyContent.length} 字符`);

      // 查找可能的结构模式
      console.log('\n🔍 查找HTML结构模式:');

      // 查找React可能的根元素
      const rootPatterns = [
        /<div[^>]*id="root"[^>]*>/i,
        /<div[^>]*id="__next"[^>]*>/i,
        /<div[^>]*id="app"[^>]*>/i,
        /<div[^>]*data-reactroot/i
      ];

      rootPatterns.forEach((pattern, index) => {
        if (pattern.test(htmlContent)) {
          console.log(`   ✅ 发现React根元素模式 ${index + 1}`);
          const match = htmlContent.match(pattern);
          if (match) {
            console.log(`     匹配内容: ${match[0]}`);
          }
        }
      });

      // 查找main元素
      const mainMatch = htmlContent.match(/<main[^>]*>/i);
      if (mainMatch) {
        console.log(`   ✅ 发现main元素: ${mainMatch[0]}`);
      } else {
        console.log('   ❌ 未发现main元素');
      }

      // 查找可能的组件结构
      console.log('\n🧩 查找组件相关结构:');

      const componentPatterns = [
        { name: 'Gallery组件', pattern: /gallery/i },
        { name: 'Card组件', pattern: /card/i },
        { name: 'Button组件', pattern: /button/i },
        { name: 'Navigation组件', pattern: /nav|navigation/i },
        { name: 'Link组件', pattern: /<a[^>]*href/i },
        { name: 'Image组件', pattern: /<img[^>]*src/i }
      ];

      componentPatterns.forEach(({ name, pattern }) => {
        const matches = htmlContent.match(pattern);
        if (matches) {
          console.log(`   ✅ ${name}: 发现 ${matches.length} 处匹配`);
        } else {
          console.log(`   ❌ ${name}: 未发现`);
        }
      });

      // 分析前500个字符的内容
      console.log('\n📖 Body开头500字符:');
      const bodyStart = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').substring(0, 500);
      console.log(`   "${bodyStart}"`);

      // 查找所有的div元素
      const divMatches = htmlContent.match(/<div[^>]*>/g);
      if (divMatches) {
        console.log(`\n📊 DIV统计: 共发现 ${divMatches.length} 个div元素`);

        // 分析前10个div的结构
        console.log('   前10个div元素:');
        divMatches.slice(0, 10).forEach((div, index) => {
          const cleanDiv = div.replace(/\s+/g, ' ').trim();
          console.log(`     ${index + 1}. ${cleanDiv}`);
        });
      }

      // 查找可能的错误或问题模式
      console.log('\n🚨 问题模式检查:');
      const problemPatterns = [
        { name: '错误文本', pattern: /error|exception|failed/i },
        { name: '404页面', pattern: /404|not found/i },
        { name: '加载问题', pattern: /loading|timeout/i },
        { name: '空白内容', pattern: /^\s*$/ },
        { name: '注释内容', pattern: /<!--[\s\S]*?-->/ }
      ];

      problemPatterns.forEach(({ name, pattern }) => {
        const matches = htmlContent.match(pattern);
        if (matches && matches.length > 0) {
          console.log(`   ⚠️ ${name}: 发现 ${matches.length} 处`);
          if (name === '注释内容') {
            // 显示前3个注释
            matches.slice(0, 3).forEach((comment, index) => {
              const cleanComment = comment.replace(/<!--/g, '').replace(/-->/g, '').trim().substring(0, 100);
              console.log(`     ${index + 1}. "${cleanComment}..."`);
            });
          }
        }
      });

      // 检查是否有Next.js特定的结构
      console.log('\n⚡ Next.js结构检查:');
      const nextjsPatterns = [
        { name: 'Next.js Script', pattern: /<script[^>]*next\/dynamic/i },
        { name: 'Next.js Data', pattern: /<script[^>]*__NEXT_DATA__/i },
        { name: 'Next.js Chunk', pattern: /chunks\/[a-zA-Z0-9-]+\.js/i }
      ];

      nextjsPatterns.forEach(({ name, pattern }) => {
        const matches = htmlContent.match(pattern);
        if (matches) {
          console.log(`   ✅ ${name}: 发现 ${matches.length} 处`);
        }
      });

      // 查找__NEXT_DATA__内容
      const nextDataMatch = htmlContent.match(/<script[^>]*__NEXT_DATA__[^>]*>([\s\S]*?)<\/script>/);
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          console.log('\n📊 Next.js页面数据:');
          console.log(`   页面路径: ${nextData.props?.pageProps || 'unknown'}`);
          console.log(`   构建ID: ${nextData.buildId || 'unknown'}`);
          console.log(`   是否为生产模式: ${nextData.runtime ? nextData.runtime : 'unknown'}`);
        } catch (e) {
          console.log('   ⚠️ __NEXT_DATA__解析失败');
        }
      }

    } else {
      console.log('❌ 未找到body标签');
    }

    // 检查DOCTYPE声明
    console.log('\n📋 DOCTYPE检查:');
    const doctypeMatch = htmlContent.match(/^<!DOCTYPE[^>]*>/i);
    if (doctypeMatch) {
      console.log(`   ✅ DOCTYPE: ${doctypeMatch[0]}`);
    } else {
      console.log('   ❌ 缺少DOCTYPE声明');
    }

    // 检查HTML标签
    console.log('\n🏷️ HTML标签检查:');
    const htmlTagMatch = htmlContent.match(/<html[^>]*>/i);
    if (htmlTagMatch) {
      console.log(`   ✅ HTML标签: ${htmlTagMatch[0]}`);
    } else {
      console.log('   ❌ 缺少HTML标签');
    }

    // 检查HEAD标签
    console.log('\n🧠 HEAD标签检查:');
    const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      const headContent = headMatch[1];
      const titleMatch = headContent.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleMatch) {
        console.log(`   ✅ 页面标题: ${titleMatch[1]}`);
      }

      const metaCount = (headContent.match(/<meta[^>]*>/gi) || []).length;
      console.log(`   Meta标签数量: ${metaCount}`);

      const linkCount = (headContent.match(/<link[^>]*>/gi) || []).length;
      console.log(`   Link标签数量: ${linkCount}`);

      const scriptCount = (headContent.match(/<script[^>]*>/gi) || []).length;
      console.log(`   Script标签数量: ${scriptCount}`);
    } else {
      console.log('   ❌ 缺少HEAD标签');
    }

  } catch (error) {
    console.error('❌ 页面结构分析失败:', error.message);
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
analyzePageStructure().catch(error => {
  console.error('💥 结构分析执行失败:', error.message);
  process.exit(1);
});