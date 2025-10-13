/**
 * ESLint Configuration for Xorigo UI Website
 *
 * 核心规则:
 * - 禁止直接导入上游包 (@xorigo-ui/registry, @xorigo-ui/tokens等)
 * - 强制使用数据适配层 (src/data/*.readonly.ts)
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'

export default [
  { ignores: ['dist', 'node_modules', '.next', '.out'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],

      // ========================================================================
      // Data Layer Protection Rules (数据层保护规则)
      // ========================================================================

      /**
       * 禁止直接导入上游包
       * 必须通过 src/data/*.readonly.ts 适配层访问
       */
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@xorigo-ui/registry', '@xorigo-ui/registry/*'],
              message:
                '❌ 禁止直接导入 @xorigo-ui/registry\n✅ 请使用: import { readonlyRegistry } from "@/data/registry.readonly"',
            },
            {
              group: ['@xorigo-ui/tokens', '@xorigo-ui/tokens/*'],
              message:
                '❌ 禁止直接导入 @xorigo-ui/tokens\n✅ 请使用: import { readonlyTokens } from "@/data/tokens.readonly" 或 "@/data/recipes.readonly"',
            },
            {
              group: ['@xorigo-ui/i18n', '@xorigo-ui/i18n/*'],
              message:
                '❌ 禁止直接导入 @xorigo-ui/i18n\n✅ 请使用: import { readonlyI18n, t } from "@/data/i18n.readonly"',
            },
            {
              group: ['@xorigo-ui/style-recipe', '@xorigo-ui/style-recipe/*'],
              message:
                '❌ 禁止直接导入 @xorigo-ui/style-recipe\n✅ 请使用: import { readonlyRecipes } from "@/data/recipes.readonly"',
            },
          ],
          paths: [
            {
              name: '@xorigo-ui/registry',
              message:
                '❌ 禁止直接导入 @xorigo-ui/registry\n✅ 请使用: import { readonlyRegistry } from "@/data/registry.readonly"',
            },
            {
              name: '@xorigo-ui/tokens',
              message:
                '❌ 禁止直接导入 @xorigo-ui/tokens\n✅ 请使用: import { readonlyTokens } from "@/data/tokens.readonly"',
            },
            {
              name: '@xorigo-ui/i18n',
              message:
                '❌ 禁止直接导入 @xorigo-ui/i18n\n✅ 请使用: import { readonlyI18n, t } from "@/data/i18n.readonly"',
            },
            {
              name: '@xorigo-ui/style-recipe',
              message:
                '❌ 禁止直接导入 @xorigo-ui/style-recipe\n✅ 请使用: import { readonlyRecipes } from "@/data/recipes.readonly"',
            },
          ],
        },
      ],

      // ========================================================================
      // General Code Quality Rules
      // ========================================================================

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  // ========================================================================
  // Overrides (覆盖规则)
  // ========================================================================

  {
    // 数据适配层文件例外 - 允许导入上游包
    files: ['src/data/*.readonly.ts', 'src/data/types.ts', 'src/data/validation.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // API路由文件例外 - 允许导入上游包
    files: ['src/app/api/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // 测试文件例外
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-imports': 'off',
    },
  },
  {
    // 配置文件例外
    files: ['*.config.js', '*.config.ts', '*.config.mjs'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-restricted-imports': 'off',
    },
  },
  {
    // 脚本文件例外
    files: ['scripts/**/*'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'no-restricted-imports': 'off',
    },
  },
]