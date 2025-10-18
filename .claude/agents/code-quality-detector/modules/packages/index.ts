/**
 * Packages 目录检测模块导出
 */

export { packagesNamingModule } from './naming-package'
export { packagesAPIModule } from './api-component'
export { classificationSystemModule } from './classification-system'

// 导入时自动注册所有模块
import './naming-package'
import './api-component'
import './classification-system'