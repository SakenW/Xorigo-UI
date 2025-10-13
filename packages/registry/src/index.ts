// Xorigo UI 组件注册表入口文件
export * from './types'
export { generateRegistry, RegistryGenerator } from './generator'
export { ComponentScanner, scanPackage, scanPackages } from './scanner'
export { RegistryAPI, createAPI, createRoutes } from './api'
export type { ScanOptions, ScanResult, ScanError } from './scanner'
export type { APIResponse, QueryOptions } from './api'
