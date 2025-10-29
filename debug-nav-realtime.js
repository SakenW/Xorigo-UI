// 导航栏LOGO实时调试脚本
const WebSocket = require('ws');

// 创建WebSocket连接到Chrome DevTools Protocol
const ws = new WebSocket('ws://localhost:9222/devtools/browser');

ws.on('open', () => {
  console.log('🔌 已连接到Chrome DevTools');

  // 启用Runtime域
  ws.send(JSON.stringify({
    id: 1,
    method: "Runtime.enable",
    params: {}
  }));

  // 启用DOM域
  ws.send(JSON.stringify({
    id: 2,
    method: "DOM.enable",
    params: {}
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);

  if (response.method === "Runtime.enable" && response.result) {
    console.log('✅ Runtime域已启用');

    // 等待DOM域启用后开始调试
    setTimeout(() => {
      startDebugging();
    }, 1000);
  }
});

function startDebugging() {
  console.log('🔍 开始调试导航栏LOGO...');

  // 启用CSS域来获取计算样式
  ws.send(JSON.stringify({
    id: 3,
    method: "CSS.enable",
    params: {}
  }));

  // 获取文档根节点
  ws.send(JSON.stringify({
    id: 4,
    method: "DOM.getDocument",
    params: {}
  }));

  // 设置一个定时器来定期检查LOGO状态
  setTimeout(() => {
    checkLogoColors();
    setInterval(checkLogoColors, 3000); // 每3秒检查一次
  }, 2000);
}

function checkLogoColors() {
  console.log('\n=== LOGO颜色状态检查 ===');

  // 查找所有SVG元素
  ws.send(JSON.stringify({
    id: Date.now(),
    method: "DOM.querySelectorAll",
    params: {
      selector: 'svg'
    }
  }));
}

ws.on('message', (data) => {
  const response = JSON.parse(data);

  if (response.method === "DOM.getDocument") {
    const rootNode = response.result.root;

    // 开始查找LOGO元素
    ws.send(JSON.stringify({
      id: Date.now(),
      method: "DOM.querySelectorAll",
      params: {
        selector: 'svg'
      }
    }));
  }

  if (response.method === "DOM.querySelectorAll") {
    const svgNodes = response.result.nodeIds;

    svgNodes.forEach((nodeId, index) => {
      // 获取SVG元素的详细信息
      ws.send(JSON.stringify({
        id: Date.now() + index,
        method: "DOM.getAttributes",
        params: {
          nodeId: nodeId
        }
      }));

      // 获取计算样式
      ws.send(JSON.stringify({
        id: Date.now() + index + 1000,
        method: "CSS.getComputedStyleForNode",
        params: {
          nodeId: nodeId
        }
      }));

      // 查找包含渐变的SVG
      ws.send(JSON.stringify({
        id: Date.now() + index + 2000,
        method: "DOM.getOuterHTML",
        params: {
          nodeId: nodeId
        }
      }));
    });
  }

  if (response.method === "DOM.getOuterHTML") {
    const html = response.result.outerHTML;

    if (html.includes('ringGradient')) {
      const nodeId = response.params.nodeId;
      console.log(`\n🎯 LOGO #${nodeId} (包含渐变):`);
      console.log('📝 HTML预览:', html.substring(0, 200) + '...');

      // 查找中心点圆圈
      const centerCircleMatch = html.match(/<circle[^>]*fill="([^"]*)"[^>]*>/);
      if (centerCircleMatch) {
        console.log('🔵 中心点颜色:', centerCircleMatch[1]);
      }
    }
  }

  if (response.method === "CSS.getComputedStyleForNode") {
    const computedStyles = response.result.computedStyle;

    // 查找关键样式属性
    const bgColor = computedStyles.find(style => style.name === 'background-color');
    const bgImage = computedStyles.find(style => style.name === 'background-image');

    if (bgColor) {
      console.log('🎨 背景色:', bgColor.value);
    }

    if (bgImage && bgImage.value !== 'none') {
      console.log('🖼️ 背景图:', bgImage.value);
    }
  }

  if (response.method === "DOM.getAttributes") {
    const attributes = response.result.attributes;
    const classNameAttr = attributes.find(attr => attr.name === 'class');

    if (classNameAttr) {
      console.log('🏷️ CSS类名:', classNameAttr.value);
    }
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket连接错误:', error);
  console.log('💡 提示：请确保Chrome已启动远程调试端口9222');
  console.log('   启动方式: chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug');
});