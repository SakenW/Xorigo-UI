/**
 * Apps 目录检测模块导出
 */

export { appsNamingModule } from './naming-app'
export { appsContentModule } from './content-app'
export { websiteArchitectureModule } from './architecture-website'

// 导入时自动注册所有模块
import './naming-app'
import './content-app'
import './architecture-website'