// Card 原子组件（示例）
import React from 'react'
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ style, ...rest }) =>
  <div style={{ borderRadius:8, border:'1px solid rgba(0,0,0,0.08)', padding:12, ...style }} {...rest} />
