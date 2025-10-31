// 指标卡
import React from 'react'
export const Stat: React.FC<{label:string; value:string|number}> = ({ label, value }) =>
  <div><div>{label}</div><strong>{String(value)}</strong></div>
