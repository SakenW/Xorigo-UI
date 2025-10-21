// Surface 原子容器（示例）
import React from 'react'
export const Surface: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ style, ...rest }) =>
  <div style={{ background:'var(--xor-background)' , color:'var(--xor-foreground)', ...style }} {...rest} />
