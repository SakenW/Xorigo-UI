import { createRequire } from "node:module";
import { dirname, join } from "node:path";
const require = createRequire(import.meta.url);
const config = {
  stories: ['../packages/core/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite')
    const path = await import('path')

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../packages/core/src'),
        },
      },
    })
  },
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}