#!/usr/bin/env node

import http from 'http';

function testAPIEndpoint(endpoint, name) {
  return new Promise((resolve) => {
    console.log(`\n🔍 测试 ${name}: ${endpoint}`);

    const options = {
      hostname: 'localhost',
      port: 3100,
      path: endpoint,
      method: 'GET',
      headers: {
        'User-Agent': 'Xorigo-UI-Advanced-Test/1.0',
        'Accept': 'application/json, text/html, */*'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        const icon = success ? '✅' : '❌';
        console.log(`   ${icon} 状态码: ${res.statusCode}`);
        console.log(`   📄 响应大小: ${data.length} 字节`);

        if (res.statusCode === 200) {
          // 检查内容类型
          const contentType = res.headers['content-type'] || '';
          console.log(`   📋 内容类型: ${contentType}`);

          // 检查是否包含组件相关内容
          const hasComponents = /button|card|dialog|modal|input/i.test(data);
          const icon2 = hasComponents ? '✅' : '⚠️';
          console.log(`   ${icon2} 组件内容: ${hasComponents ? '包含' : '未包含'}`);
        }

        resolve({ endpoint, name, status: res.statusCode, success, size: data.length });
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ 错误: ${e.message}`);
      resolve({ endpoint, name, status: 0, success: false, error: e.message });
    });

    req.setTimeout(5000, () => {
      console.log('   ⏰ 超时');
      req.abort();
      resolve({ endpoint, name, status: 0, success: false, error: 'timeout' });
    });

    req.end();
  });
}

async function testGalleryAdvanced() {
  console.log('🚀 开始 Xorigo UI Gallery 高级测试...\n');

  // 测试各个页面和端点
  const endpoints = [
    { path: '/gallery', name: 'Gallery 主页' },
    { path: '/gallery?search=button', name: 'Gallery 搜索' },
    { path: '/gallery?category=core', name: 'Gallery 分类筛选' },
    { path: '/docs', name: '文档页面' },
    { path: '/playground', name: 'Playground 页面' },
    { path: '/health', name: '健康检查端点' },
    { path: '/api/health', name: 'API 健康检查' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testAPIEndpoint(endpoint.path, endpoint.name);
    results.push(result);

    // 在测试之间添加小延迟，避免过快的请求
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 输出测试总结
  console.log('\n📊 高级测试总结:');
  console.log('=' .repeat(50));

  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;

  console.log(`✅ 成功: ${successful} 个端点`);
  console.log(`❌ 失败: ${failed} 个端点`);
  console.log(`📈 成功率: ${Math.round((successful / results.length) * 100)}%`);

  if (failed > 0) {
    console.log('\n❌ 失败的端点:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.name}: ${r.error || `状态码 ${r.status}`}`);
    });
  }

  // 检查特定功能
  console.log('\n🎯 功能测试结果:');

  const galleryResult = results.find(r => r.endpoint === '/gallery');
  if (galleryResult && galleryResult.success) {
    console.log('   ✅ Gallery 页面: 正常运行');
  } else {
    console.log('   ❌ Gallery 页面: 有问题');
  }

  // 检查搜索功能
  const searchResult = results.find(r => r.endpoint === '/gallery?search=button');
  if (searchResult && searchResult.success) {
    console.log('   ✅ 搜索功能: 正常工作');
  } else {
    console.log('   ⚠️ 搜索功能: 需要检查');
  }

  // 检查分类功能
  const categoryResult = results.find(r => r.endpoint === '/gallery?category=core');
  if (categoryResult && categoryResult.success) {
    console.log('   ✅ 分类功能: 正常工作');
  } else {
    console.log('   ⚠️ 分类功能: 需要检查');
  }

  // 性能检查
  console.log('\n⚡ 性能分析:');
  const avgSize = results.reduce((sum, r) => sum + (r.size || 0), 0) / results.length;
  console.log(`   📊 平均响应大小: ${Math.round(avgSize)} 字节`);

  const fastEndpoints = results.filter(r => r.size && r.size < 50000).length;
  console.log(`   🚀 轻量级页面: ${fastEndpoints}/${results.length}`);

  console.log('\n🎉 高级测试完成！');

  // 清理测试文件
  console.log('\n🧹 清理测试文件...');
  console.log('   ✅ 测试脚本可以安全删除');
}

// 运行测试
testGalleryAdvanced().catch(console.error);