#!/usr/bin/env node

/**
 * 简单的Gallery页面检查脚本
 * 模拟浏览器行为，检查页面是否正常渲染
 */

const https = require('https');
const http = require('http');

async function checkGalleryPage() {
  console.log('🔍 检查Gallery页面状态...\n');

  const url = 'http://localhost:3100/gallery';

  try {
    const startTime = Date.now();

    // 获取页面内容
    const htmlContent = await fetchPageContent(url);

    const loadTime = Date.now() - startTime;
    console.log(`⚡ 页面加载时间: ${loadTime}ms`);
    console.log(`📄 页面大小: ${htmlContent.length} bytes`);

    // 基础检查
    const hasTitle = htmlContent.includes('组件库展示 - Xorigo UI');
    const hasGalleryComponent = htmlContent.includes('GalleryServer');
    const has404Content = htmlContent.includes('抱歉，您访问的页面不存在');
    const hasReactLoading = htmlContent.includes('requestAnimationFrame');

    console.log('\n📊 页面内容分析:');
    console.log(`   ✅ 正确标题: ${hasTitle ? '是' : '否'}`);
    console.log(`   ✅ Gallery组件: ${hasGalleryComponent ? '是' : '否'}`);
    console.log(`   ⚠️ 404内容: ${has404Content ? '是' : '否'}`);
    console.log(`   ✅ React加载: ${hasReactLoading ? '是' : '否'}`);

    // 检查脚本加载状态
    const scriptMatches = htmlContent.match(/<script[^>]*src="([^"]*)"[^>]*>/g) || [];
    const scriptCount = scriptMatches.length;
    console.log(`\n📦 JavaScript脚本: ${scriptCount} 个`);

    // 检查样式表
    const styleMatches = htmlContent.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
    const styleCount = styleMatches.length;
    console.log(`🎨 CSS样式表: ${styleCount} 个`);

    // 综合评估
    console.log('\n🎯 诊断结果:');

    if (hasTitle && hasGalleryComponent && !has404Content) {
      console.log('   ✅ Gallery页面正常加载');
    } else if (hasTitle && hasGalleryComponent && has404Content) {
      console.log('   ⚠️ Gallery页面正在加载但存在渲染问题');
      console.log('   💡 建议: 检查浏览器控制台的JavaScript错误');
    } else if (has404Content) {
      console.log('   ❌ 页面显示404错误');
    } else {
      console.log('   ❓ 页面状态未知');
    }

    // 性能评估
    if (loadTime < 1000) {
      console.log(`   ⚡ 加载速度: 快速 (${loadTime}ms)`);
    } else if (loadTime < 3000) {
      console.log(`   ⚡ 加载速度: 正常 (${loadTime}ms)`);
    } else {
      console.log(`   ⚠️ 加载速度: 较慢 (${loadTime}ms)`);
    }

    // 建议操作
    console.log('\n💡 建议的下一步操作:');
    console.log('   1. 在浏览器中访问 http://localhost:3100/gallery');
    console.log('   2. 打开开发者工具 (F12)');
    console.log('   3. 检查 Console 面板是否有JavaScript错误');
    console.log('   4. 检查 Network 面板确认所有资源加载成功');
    console.log('   5. 检查 Elements 面板查看DOM结构');

  } catch (error) {
    console.error('❌ 页面检查失败:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 连接被拒绝，可能的原因:');
      console.log('   - Docker容器未运行');
      console.log('   - 端口3100未开放');
      console.log('   - 开发服务器未启动');
    }
  }
}

function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
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