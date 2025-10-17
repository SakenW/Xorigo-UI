import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🏁 Playwright视觉回归测试完成');

  // 清理测试结果（可选）
  // 可以在这里执行清理操作
}

export default globalTeardown;