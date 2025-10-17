/**
 * Tree-shaking 测试文件
 * 验证按需导入是否有效工作
 */

// 测试1: 分类导入
import { Button, Card } from './dist/ui.mjs'
import { Input } from './dist/inputs.mjs'
import { Grid, Flex } from './dist/layout.mjs'

// 测试2: 组件级导入（如果支持）
// import Button from './dist/Button.mjs'
// import Card from './dist/Card.mjs'

// 测试3: 工具函数导入
import { c as cn } from './dist/cn-B6yFEsav.js'

console.log('Button:', Button)
console.log('Card:', Card)
console.log('Input:', Input)
console.log('Grid:', Grid)
console.log('Flex:', Flex)
console.log('cn utility:', cn)

// 验证模块是否正确导出
const exportedModules = {
  Button: typeof Button,
  Card: typeof Card,
  Input: typeof Input,
  Grid: typeof Grid,
  Flex: typeof Flex,
  cn: typeof cn
}

console.log('导出模块类型检查:', exportedModules)