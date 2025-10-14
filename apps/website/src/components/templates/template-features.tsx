/**
 * Template 功能特性组件
 * 展示模板包含的功能特性列表
 */

import { TemplateFeature } from '@/types/templates'

interface TemplateFeaturesProps {
  features: TemplateFeature[]
}

export function TemplateFeatures({ features }: TemplateFeaturesProps) {
  const includedFeatures = features.filter(f => f.included)
  const excludedFeatures = features.filter(f => !f.included)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">功能特性</h2>

      {/* 已包含的功能 */}
      <div className="space-y-4 mb-8">
        <h3 className="font-medium text-green-600 dark:text-green-400">
          ✓ 已包含功能 ({includedFeatures.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {includedFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
            >
              <div className="text-green-600 dark:text-green-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {feature.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 未包含的功能 */}
      {excludedFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-500">
            ○ 计划中功能 ({excludedFeatures.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {excludedFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg opacity-75"
              >
                <div className="text-gray-400 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {feature.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 功能统计 */}
      <div className="mt-6 pt-6 border-t dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            功能完成度
          </div>
          <div className="font-medium text-gray-900 dark:text-white">
            {Math.round((includedFeatures.length / features.length) * 100)}%
          </div>
        </div>
        <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(includedFeatures.length / features.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}