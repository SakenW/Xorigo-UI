import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import { check } from '@astrojs/check'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Xorigo UI 文档',
      description: '现代化 React UI 组件库技术文档',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: true
      },
      customCss: [
        './src/styles/custom.css'
      ],
      social: {
        github: 'https://github.com/your-org/xorigo-ui',
      },
      editLink: {
        baseUrl: 'https://github.com/your-org/xorigo-ui/edit/main/apps/docs/'
      },
      sidebar: [
        {
          label: '开始',
          items: [
            { label: '介绍', link: '/' },
            { label: '快速开始', link: 'guides/getting-started' },
            { label: '安装', link: 'guides/installation' },
          ]
        },
        {
          label: '组件',
          items: [
            { label: '概览', link: 'components/overview' },
            { label: 'Button 按钮', link: 'components/button' },
            { label: 'Card 卡片', link: 'components/card' },
            { label: 'Input 输入框', link: 'components/input' },
            { label: 'Modal 模态框', link: 'components/modal' },
          ]
        },
        {
          label: '设计系统',
          items: [
            { label: '设计令牌', link: 'design/tokens' },
            { label: '颜色系统', link: 'design/colors' },
            { label: '字体排版', link: 'design/typography' },
            { label: '间距系统', link: 'design/spacing' },
          ]
        },
        {
          label: '主题系统',
          items: [
            { label: '主题概览', link: 'themes/overview' },
            { label: '内置主题', link: 'themes/built-in' },
            { label: '自定义主题', link: 'themes/custom' },
          ]
        },
        {
          label: '开发指南',
          items: [
            { label: '架构设计', link: 'development/architecture' },
            { label: '贡献指南', link: 'development/contributing' },
            { label: '测试策略', link: 'development/testing' },
            { label: '发布流程', link: 'development/release' },
          ]
        },
        {
          label: 'API 参考',
          items: [
            { label: '核心 API', link: 'api/core' },
            { label: 'Hooks', link: 'api/hooks' },
            { label: '工具函数', link: 'api/utils' },
          ]
        }
      ]
    }),
    react(),
    mdx(),
    check()
  ],
  output: 'static',
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
})