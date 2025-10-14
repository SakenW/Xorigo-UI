/**
 * Showcase Module - 案例展示
 * 核心职能：社区作品和设计灵感展示
 * 不包含：源代码、模板下载、技术教程
 */

const showcases = [
  {
    id: 1,
    title: 'TechCorp 官网重构',
    author: 'Design Studio X',
    category: '企业官网',
    image: '/showcase/techcorp.jpg',
    likes: 234,
    featured: true,
  },
  {
    id: 2,
    title: 'EduPlatform 在线教育平台',
    author: 'Creative Team',
    category: '教育平台',
    image: '/showcase/eduplatform.jpg',
    likes: 189,
    featured: false,
  },
  {
    id: 3,
    title: 'FinanceApp 移动端设计',
    author: 'Mobile First Studio',
    category: '金融应用',
    image: '/showcase/financeapp.jpg',
    likes: 321,
    featured: true,
  },
]

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Showcase 案例展示</h1>
          <p className="text-lg text-gray-600">
            探索使用 Xorigo UI 创建的优秀作品，获取设计灵感
          </p>
        </div>

        {/* 分类标签 */}
        <div className="flex justify-center gap-4 mb-8">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full">
            全部
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            精选作品
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            企业官网
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            应用界面
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            创新设计
          </button>
        </div>

        {/* 作品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
            >
              {/* 预览图 */}
              <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-600 relative">
                {item.featured && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-black text-sm font-semibold rounded">
                    精选
                  </span>
                )}
                <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                  {item.title}
                </div>
              </div>

              {/* 作品信息 */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  by {item.author}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {item.category}
                  </span>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500">
                    <span>❤️</span>
                    <span>{item.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 提交作品 CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">分享您的作品</h2>
            <p className="text-gray-600 mb-6">
              使用 Xorigo UI 创建了优秀的作品？提交展示给社区！
            </p>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              提交作品
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}