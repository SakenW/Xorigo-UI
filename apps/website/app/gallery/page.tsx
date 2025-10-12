export default function Gallery() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">组件画廊</h1>
      <p className="text-lg text-gray-600 mb-8">
        探索 TH-UI 组件库的完整设计系统和界面模式
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          { title: "按钮组件", emoji: "🔘", desc: "各种样式的按钮组件集合" },
          { title: "卡片布局", emoji: "🃏", desc: "响应式卡片布局模式" },
          { title: "表单模板", emoji: "📝", desc: "完整的表单页面模板" },
          { title: "导航组件", emoji: "🧭", desc: "多种导航栏组件样式" },
          { title: "数据表格", emoji: "📊", desc: "功能完整的数据表格组件" },
          { title: "模态框系统", emoji: "🪟", desc: "灵活的模态框和弹窗系统" },
          { title: "仪表板模板", emoji: "📈", desc: "管理后台仪表板模板" },
          { title: "加载动画", emoji: "⏳", desc: "各种加载状态和动画效果" },
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4 text-center">{item.emoji}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
