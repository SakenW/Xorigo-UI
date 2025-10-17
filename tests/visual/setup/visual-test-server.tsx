import React from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentTestPage, ResponsiveTestPage } from '../fixtures/component-pages';

/**
 * 视觉测试服务器
 * 提供测试页面用于Playwright截图
 */

const TestApp: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 'components';
  const theme = urlParams.get('theme') || 'default';

  // 设置主题
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderPage = () => {
    switch (page) {
      case 'components':
        return <ComponentTestPage theme={theme} />;
      case 'responsive':
        return <ResponsiveTestPage />;
      default:
        return <ComponentTestPage theme={theme} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面指示器 */}
      <div className="fixed top-4 right-4 bg-black/10 text-white px-3 py-1 rounded text-sm z-50">
        {page} - {theme}
      </div>

      {/* 渲染测试页面 */}
      {renderPage()}

      {/* 测试控制面板 */}
      <div className="fixed bottom-4 left-4 bg-white border rounded shadow-lg p-4 z-50 max-w-xs">
        <h3 className="font-semibold mb-2">测试控制面板</h3>
        <div className="space-y-2 text-sm">
          <div>页面: <span className="font-mono bg-gray-100 px-1 rounded">{page}</span></div>
          <div>主题: <span className="font-mono bg-gray-100 px-1 rounded">{theme}</span></div>
          <div>视口: <span className="font-mono bg-gray-100 px-1 rounded">{window.innerWidth}x{window.innerHeight}</span></div>
          <div>时间戳: <span className="font-mono bg-gray-100 px-1 rounded">{new Date().toISOString()}</span></div>
        </div>
      </div>
    </div>
  );
};

// 渲染应用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
}

// 导出用于测试的全局函数
declare global {
  interface Window {
    // 主题切换函数
    setTheme: (theme: string) => void;
    // 视口切换函数
    setViewport: (width: number, height: number) => void;
    // 测试工具函数
    visualTestHelpers: {
      getAllElements: (selector: string) => Element[];
      getElementScreenshot: (element: Element) => Promise<string>;
      simulateInteraction: (element: Element, action: string) => Promise<void>;
    };
  }
}

// 设置全局测试函数
window.setTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
  // 触发主题变化事件
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
};

window.setViewport = (width: number, height: number) => {
  // 这个函数主要用于开发时模拟，实际测试中由Playwright控制视口
  console.log(`设置视口: ${width}x${height}`);
};

window.visualTestHelpers = {
  // 获取所有匹配的元素
  getAllElements: (selector: string) => {
    return Array.from(document.querySelectorAll(selector));
  },

  // 获取元素的截图数据
  getElementScreenshot: async (element: Element) => {
    // 这里可以扩展为返回元素的截图数据
    return '';
  },

  // 模拟交互
  simulateInteraction: async (element: Element, action: string) => {
    switch (action) {
      case 'hover':
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        break;
      case 'click':
        (element as HTMLElement).click();
        break;
      case 'focus':
        (element as HTMLElement).focus();
        break;
      case 'blur':
        (element as HTMLElement).blur();
        break;
    }
    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

// 添加错误处理
window.addEventListener('error', (event) => {
  console.error('视觉测试服务器错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
});

// 开发模式下显示更多信息
if (process.env.NODE_ENV === 'development') {
  console.log('🎨 视觉测试服务器已启动');
  console.log('📱 可用页面: components, responsive');
  console.log('🎨 可用主题: default, ocean, sunset, forest, purple, midnight, candy, corporate, minimal, dark');
}