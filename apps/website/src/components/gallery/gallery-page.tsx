// TODO: 此组件需要重新实现以适配新的组件库导出
// 暂时提供简化版本

export function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Gallery 画廊</h1>
        <p className="text-lg text-gray-600">配方展示画廊开发中</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">开发状态</h2>
        <p className="text-gray-700">此页面需要重新实现以适配新的 @th-ui/style-recipe 包架构。</p>
      </div>
    </div>
  )
}

export default GalleryPage
