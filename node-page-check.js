const http = require('http');
const https = require('https');
const zlib = require('zlib');

/**
 * Node.js页面检查工具 - 不依赖浏览器
 * 通过HTTP请求分析页面内容和JavaScript错误
 */

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;

    const req = protocol.request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    }, (res) => {
      let data = Buffer.alloc(0);

      res.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      });

      res.on('end', () => {
        let body = data;

        // 处理gzip压缩
        const encoding = res.headers['content-encoding'];
        if (encoding === 'gzip') {
          try {
            body = zlib.gunzipSync(data);
          } catch (error) {
            console.log('⚠️ gzip解压失败，使用原始数据');
          }
        } else if (encoding === 'deflate') {
          try {
            body = zlib.inflateSync(data);
          } catch (error) {
            console.log('⚠️ deflate解压失败，使用原始数据');
          }
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body.toString('utf8')
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

function analyzePage(html) {
  const analysis = {
    title: '',
    metaDescription: '',
    hasGalleryContent: false,
    has404Content: false,
    hasReactContent: false,
    hasErrorContent: false,
    componentCount: 0,
    scriptCount: 0,
    linkCount: 0,
    potentialErrors: [],
    keyElements: []
  };

  // 提取标题
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    analysis.title = titleMatch[1].trim();
  }

  // 提取meta描述
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (descMatch) {
    analysis.metaDescription = descMatch[1].trim();
  }

  // 检查关键内容
  const keyPatterns = [
    { pattern: /Xorigo UI 组件库/gi, desc: 'Gallery标题', found: false },
    { pattern: /组件库展示/gi, desc: '组件库文本', found: false },
    { pattern: /404/gi, desc: '404标记', found: false },
    { pattern: /页面不存在/gi, desc: '404文本', found: false },
    { pattern: /React/gi, desc: 'React引用', found: false },
    { pattern: /Base 基础组件/gi, desc: '基础组件分类', found: false },
    { pattern: /Layout 布局组件/gi, desc: '布局组件分类', found: false },
    { pattern: /Navigation 导航组件/gi, desc: '导航组件分类', found: false },
    { pattern: /Form 表单组件/gi, desc: '表单组件分类', found: false }
  ];

  keyPatterns.forEach(item => {
    item.found = item.pattern.test(html);
    if (item.found) {
      analysis.keyElements.push(item.desc);
    }
  });

  analysis.hasGalleryContent = keyPatterns[0].found || keyPatterns[1].found;
  analysis.has404Content = keyPatterns[2].found || keyPatterns[3].found;
  analysis.hasReactContent = keyPatterns[4].found;

  // 统计元素
  analysis.componentCount = (html.match(/class="[^"]*component[^"]*"/gi) || []).length;
  analysis.scriptCount = (html.match(/<script/gi) || []).length;
  analysis.linkCount = (html.match(/<link/gi) || []).length;

  // 查找潜在错误
  const errorPatterns = [
    /error[:\s]*[^;}]*/gi,
    /Cannot find module/gi,
    /Module not found/gi,
    /TypeError[:\s]*[^;}]*/gi,
    /ReferenceError[:\s]*[^;}]*/gi
  ];

  errorPatterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) {
      analysis.potentialErrors.push(...matches.slice(0, 3)); // 最多取3个
    }
  });

  analysis.hasErrorContent = analysis.potentialErrors.length > 0;

  return analysis;
}

async function checkGalleryPage() {
  console.log('🔍 开始Node.js页面检查...');

  const url = 'http://localhost:3100/gallery';

  try {
    console.log('📡 发送HTTP请求...');
    const start = Date.now();

    const response = await makeRequest(url);
    const end = Date.now();

    console.log(`✅ 请求完成 (${end - start}ms)`);
    console.log(`📊 状态码: ${response.statusCode}`);
    console.log(`📏 内容大小: ${response.body.length} 字节`);
    console.log(`🏷️ 内容类型: ${response.headers['content-type'] || '未知'}`);

    if (response.statusCode === 200) {
      console.log('🔍 分析页面内容...');

      const analysis = analyzePage(response.body);

      console.log('\n📋 页面分析结果:');
      console.log(`   页面标题: ${analysis.title}`);
      console.log(`   Meta描述: ${analysis.metaDescription || '无'}`);

      console.log('\n🎯 内容检测:');
      console.log(`   Gallery内容: ${analysis.hasGalleryContent ? '✅' : '❌'}`);
      console.log(`   404内容: ${analysis.has404Content ? '❌' : '✅'}`);
      console.log(`   React内容: ${analysis.hasReactContent ? '✅' : '❌'}`);
      console.log(`   错误内容: ${analysis.hasErrorContent ? '❌' : '✅'}`);

      console.log('\n🧩 关键元素:');
      if (analysis.keyElements.length > 0) {
        analysis.keyElements.forEach(element => {
          console.log(`   ✅ ${element}`);
        });
      } else {
        console.log('   ❌ 未检测到关键元素');
      }

      console.log('\n📊 统计信息:');
      console.log(`   组件数量: ${analysis.componentCount}`);
      console.log(`   脚本数量: ${analysis.scriptCount}`);
      console.log(`   链接数量: ${analysis.linkCount}`);

      if (analysis.potentialErrors.length > 0) {
        console.log('\n⚠️ 潜在错误:');
        analysis.potentialErrors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error.trim()}`);
        });
      }

      // 保存HTML到文件用于进一步分析
      require('fs').writeFileSync('/tmp/gallery-content.html', response.body);
      console.log('\n💾 页面HTML已保存到 /tmp/gallery-content.html');

      // 最终诊断
      console.log('\n🎯 最终诊断:');
      if (analysis.hasGalleryContent && !analysis.has404Content) {
        console.log('   ✅ Gallery页面正常显示');
        if (analysis.hasErrorContent) {
          console.log('   ⚠️ 但可能存在JavaScript错误');
        }
      } else if (analysis.has404Content) {
        console.log('   ❌ 页面显示404错误');
      } else {
        console.log('   ❓ 页面状态不明确，需要进一步检查');
      }

    } else {
      console.log(`❌ HTTP错误: ${response.statusCode}`);
    }

  } catch (error) {
    console.error('❌ 页面检查失败:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 故障排除建议:');
      console.log('   1. 检查Docker容器是否正在运行');
      console.log('   2. 确认端口3100可访问');
      console.log('   3. 检查网络连接');
      console.log('   4. 验证应用是否正确启动');
    }
  }
}

// 运行检查
checkGalleryPage().catch(error => {
  console.error('💥 检查执行失败:', error.message);
  process.exit(1);
});