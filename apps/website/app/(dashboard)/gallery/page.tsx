import { GalleryServer } from '@/components/gallery/gallery-server'

/**
 * Gallery 页面 - RSC 优化版本
 * 服务端数据获取 + 客户端交互分离
 */
export default function Gallery() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <GalleryServer />
    </div>
  )
}