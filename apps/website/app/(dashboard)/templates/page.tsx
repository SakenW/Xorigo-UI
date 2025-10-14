/**
 * Templates Module - 完整项目模板
 * 核心职能：提供完整的项目起始模板
 * 不包含：单个组件、在线编辑器、组件文档
 */

const templates = [
  {
    id: 'landing-page',
    name: '营销落地页',
    category: 'starter',
    description: '现代化的产品营销落地页模板',
    preview: '/templates/landing-preview.jpg',
    technologies: ['Next.js', 'Tailwind', 'Framer Motion'],
  },
  {
    id: 'admin-dashboard',
    name: '管理后台',
    category: 'application',
    description: '功能完整的管理后台模板',
    preview: '/templates/admin-preview.jpg',
    technologies: ['Next.js', 'TypeScript', 'Recharts'],
  },
  {
    id: 'ecommerce',
    name: '电商网站',
    category: 'industry',
    description: '完整的电子商务解决方案',
    preview: '/templates/ecommerce-preview.jpg',
    technologies: ['Next.js', 'Stripe', 'Prisma'],
  },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Templates 项目模板</h1>

        {/* 分类筛选 */}
        <div className="mb-8">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              全部
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
              基础模板
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
              行业方案
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
              完整应用
            </button>
          </div>
        </div>

        {/* 模板网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* 预览图 */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700">
                {/* TODO: 添加实际预览图 */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  预览图
                </div>
              </div>

              {/* 模板信息 */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                {/* 技术栈标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    使用模板
                  </button>
                  <button className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    预览
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}