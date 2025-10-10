import React from "react"

export default function BreadcrumbDemo() {
  const items = [
    { label: '首页', href: '/' },
    { label: '组件库', href: '/components' },
    { label: '导航组件', href: '#navigation' },
    { label: '面包屑' },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🧭 导航组件 - 面包屑</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        {/* 基础面包屑 */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {items.map((item, index) => {
              const isLast = index === items.length - 1
              return (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="shrink-0 h-5 w-5 text-gray-400 mx-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {isLast ? (
                    <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                  ) : (
                    <a
                      href={item.href}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        {/* 斜杠分隔符样式 */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">斜杠分隔符:</h3>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center">
              {items.map((item, index) => {
                const isLast = index === items.length - 1
                return (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    {isLast ? (
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                    ) : (
                      <a
                        href={item.href}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  )
}
