import React from 'react'
import type { DecoratorFunction } from '@storybook/react'
import { ThemeProvider } from '@xorigo-ui/system'

export const withTheme: DecoratorFunction = (Story) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
)