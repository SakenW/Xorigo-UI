import * as assert from 'assert'
import * as vscode from 'vscode'
import { ComponentRegistry } from '../../data/component-registry'
import { ThemeData } from '../../data/theme-data'

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('开始运行所有测试。')

  test('组件注册表 - 加载组件', async () => {
    const registry = new ComponentRegistry()
    await registry.loadComponents()

    const components = registry.getAllComponents()
    assert.ok(components.length > 0, '应该注册了组件')

    const button = registry.getComponent('Button')
    assert.ok(button, '应该能找到 Button 组件')
    assert.strictEqual(button.name, 'Button', '组件名应该是 Button')
    assert.ok(button.variants.includes('primary'), '应该包含 primary 变体')
  })

  test('组件注册表 - 按分类获取组件', () => {
    const registry = new ComponentRegistry()

    const inputs = registry.getComponentsByCategory('Inputs')
    assert.ok(inputs.length > 0, 'Inputs 分类应该包含组件')
  })

  test('主题数据 - 加载主题', async () => {
    const themeData = new ThemeData()
    await themeData.loadThemes()

    const themes = themeData.getAllThemes()
    assert.ok(themes.length > 0, '应该注册了主题')

    const corporateBlue = themeData.getTheme('corporate-blue')
    assert.ok(corporateBlue, '应该能找到 corporate-blue 主题')
    assert.strictEqual(corporateBlue.name, 'Corporate Blue', '主题名应该是 Corporate Blue')
  })

  test('主题数据 - 按分类获取主题', async () => {
    const themeData = new ThemeData()
    await themeData.loadThemes()

    const corporateThemes = themeData.getThemesByCategory('Corporate')
    assert.ok(corporateThemes.length > 0, 'Corporate 分类应该包含主题')
  })

  test('主题数据 - 搜索主题', async () => {
    const themeData = new ThemeData()
    await themeData.loadThemes()

    const results = themeData.searchThemes('corporate')
    assert.ok(results.length > 0, '搜索 "corporate" 应该返回结果')
  })
})
